"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FileUpload from "../FileUpload";
import { mutate } from "@/hooks/useQueryProcessor";
import { useRouter } from "next/navigation";
import { Server } from "@prisma/client";
import { useModal } from "@/hooks/use-modal-store";
import LoadingSpinner from "../loaders/LoadingSpinner";
import toast from "react-hot-toast";

export const formSchema = z.object({
  name: z.string().min(1, {
    message: "Server name is required",
  }),
  imageUrl: z.string().min(1, {
    message: "Server image is Required",
  }),
});

export type formType = z.infer<typeof formSchema>;

const CreateServerModal = () => {
  const { isOpen, type, onClose } = useModal();

  const isModalOpen = isOpen && type === "createServer";

  const router = useRouter();

  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
    mode: 'all'
  });

  const { isSubmitting: isLoading } = form.formState;

  const createServer = mutate<formType, Server>("/servers", "POST", [
    "servers",
  ]);
  const onSubmit: SubmitHandler<formType> = async (values) => {
    try {
      createServer.mutate(values, {
        onSuccess: (data) => {
          toast.success('Image uploaded')
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
            Customize your server
          </DialogTitle>

          <DialogDescription className="text-center text-zinc">
            Give your server a personality with a name and image an image. You
            can always change it later.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="serverImage"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Server name
                    </FormLabel>

                    <FormControl>
                      <Input
                        disabled={isLoading || createServer.isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter server name"
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

export default CreateServerModal;
