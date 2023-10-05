"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mutate } from "@/hooks/useQueryProcessor";
import { useParams, useRouter } from "next/navigation";
import { Channel, ChannelType, Server } from "@prisma/client";
import { useModal } from "@/hooks/use-modal-store";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingSpinner from "../loaders/LoadingSpinner";
import toast from "react-hot-toast";

export const formSchema = z.object({
  name: z.string().min(1, {
    message: "Server name is required",
  }).refine(name => name !== 'general', {
    message: "Channel name cannot be 'general'"
  }),
  type: z.nativeEnum(ChannelType)
});

export type formType = z.infer<typeof formSchema>;

const CreateChannelModal = () => {
  const { isOpen, type, onClose } = useModal();
  const isModalOpen = isOpen && type === "createChannel";
  const router = useRouter();
  const {serverId} = useParams()
  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "TEXT"
    },
     mode: 'all'
  });
  const { isSubmitting: isLoading} = form.formState;

  const createServer = mutate<formType, Channel>(`/channels?serverId=${serverId}`, "POST", [
    "channels ",
  ]);

  const onSubmit: SubmitHandler<formType> = async (values) => {
    try {
      createServer.mutate(values, {
        onSuccess: (data) => {
          toast.success('Channel created')
          form.reset();
          router.refresh();
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Create channel
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              

              <FormField 
                control={form.control}
                name="type"
                render={({field}) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Channel Type
                    </FormLabel>
                    <Select disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                          <SelectValue placeholder="Select a channel type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ChannelType).map((type) => (
                          <SelectItem key={type} value={type} className="capitalize">
                            {type.toLocaleLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Channel name
                    </FormLabel>

                    <FormControl>
                      <Input
                      // {...register('name')}
                        disabled={isLoading || createServer.isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter channel name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4 ">
              <Button
                disabled={isLoading || createServer.isLoading}
                variant={"primary"}
              >
                {(() => {
                  if (isLoading || createServer.isLoading)
                    return <LoadingSpinner size={20} />;

                  return "Create";
                })()}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannelModal;
