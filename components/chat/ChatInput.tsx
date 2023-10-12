"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Plus, Smile } from "lucide-react";
import qs from 'query-string'
import axios from "axios";
import { useModal } from "@/hooks/use-modal-store";
import EmojiPicker from "../EmojiPicker";
import { useRouter } from "next/navigation";
type ChatInputProps = {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "conversation" | "channel";
};

const formSchema = z.object({
  content: z.string().min(1),
});

type formType = z.infer<typeof formSchema>;

const ChatInput: React.FC<ChatInputProps> = ({ apiUrl, query, name, type }) => {

  const {onOpen} = useModal();
  
  const router = useRouter()
  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
    mode: "all",
  });

  const isLoading = form.formState.isSubmitting;

  const { handleSubmit } = form;

  const onSubmit: SubmitHandler<formType> = async (values) => {
    try {
      const url = qs.stringifyUrl({
        url: `${origin}${apiUrl}`,
        query
      });
      const res = await axios.post(url, values); 
      form.reset();
      router.refresh()
    } catch (error) {
      console.error(error)
    }
  };


  return (
    <Form {...form}>
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <FormField
        control={form.control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="relative p-4 pb-6">
                <button
                onClick={() => onOpen('messageFile', {apiUrl, query})}
                  type="button"
                  className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
                >
                  <Plus className="text-white dark:text-[#313338]" />
                </button>
                <Input
                  disabled={isLoading}
                  className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                  placeholder={`Message ${type === "conversation" ? name : "#" + name}`}
                  {...field}
                />
                <div className="absolute top-7 right-8">
                    <EmojiPicker onChange={(emoji) => { field.onChange(`${field.value}${emoji.native}`)}} />
                </div>
              </div>
            </FormControl>
          </FormItem>
        )}
      />
    </form>
  </Form>
  );
};
export default ChatInput;
