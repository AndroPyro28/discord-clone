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
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FileUpload from "../FileUpload";
import { mutate } from "@/hooks/useQueryProcessor";
import { useRouter } from "next/navigation";
import { Server } from "@prisma/client";
import LoadingSpinner from "../loaders/LoadingSpinner";
import { useModal } from "@/hooks/use-modal-store";
import qs from "query-string";
import axios from "axios";
import toast from "react-hot-toast";

export const formSchema = z.object({
  fileUrl: z.string().min(1, {
    message: "Attachment is required",
  }),
});

export type formType = z.infer<typeof formSchema>;

const MessageFileModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const router = useRouter();

  const isModalOpen = isOpen && type === "messageFile";

  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: "",
    },
    mode: "all",
  });

  const { isSubmitting: isLoading } = form.formState;
  const { apiUrl, query } = data;

  const onSubmit: SubmitHandler<formType> = async (values) => {
    try {
      const url = qs.stringifyUrl({
        url: `${apiUrl}`,
        query,
      });

      const res = await axios.post(url, {
        ...values,
        content: values.fileUrl,
      });
      // router.refresh();
      form.reset();
      onClose();
      toast.success("File has been sent!");
    } catch (error) {
      console.error(error);
    }
  };

  // if there's a file that has been uploaded but didn't send we will delete it
  const deleteFile = mutate<string, null>(
    `/upload-thing-delete/`,
    "POST",
    ["delete", "uploadthing"]
  );

  const handleClose = () => {
    const fileUrl = form.getValues("fileUrl");
    if (fileUrl) {
      deleteFile.mutate(fileUrl.replaceAll("https://utfs.io/f/", ""));
    }
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Add an attachment
          </DialogTitle>

          <DialogDescription className="text-center text-zinc">
            Send a file as a message
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="messageFile"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4 ">
              <Button disabled={isLoading} variant={"primary"}>
                {(() => {
                  if (isLoading) return <LoadingSpinner size={20} />;

                  return "Send";
                })()}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MessageFileModal;
