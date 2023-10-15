"use client";
import { Member, Message, User } from "@prisma/client";
import React, { useEffect } from "react";
import ChatWelcome from "./ChatWelcome";
import useChatQuery from "@/hooks/useChatQuery";
import { Loader2, ServerCrash } from "lucide-react";
import ChatItem from "./ChatItem";
import {format} from 'date-fns'
import { useChatSocket } from "@/hooks/useChatSocket";
import { useRouter } from "next/navigation";
import { io as ClientIO } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";

const DATE_FORMAT = `d MMM yyyy, HH:mm`

type ChatMessagesProps = {
  name: string;
  chatId: string;
  member: Member;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
};

type MessageWithMemberWithUser = Message & {
  member: Member & {
    user: User;
  };
};

const ChatMessages: React.FC<ChatMessagesProps> = ({
  name,
  chatId,
  member,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  type,
  paramValue,
}) => {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`
  const updateKey = `chat:${chatId}:messages:update`
  const router = useRouter();

  const { fetchNextPage, hasNextPage, data, isFetchingNextPage, status, refetch } =
    useChatQuery({ queryKey, paramKey, paramValue, apiUrl });
    // useChatSocket({queryKey, addKey, updateKey})

    const queryClient = useQueryClient();

    useEffect(() => {
      console.log('useEffect chat socket rendering')
      const socketInstance = new (ClientIO as any)(
        process.env.NEXT_PUBLIC_SITE_URL!,
        { path: "/api/socket/io", addTrailingSlash: false }
      );
          if(!socketInstance) {
              console.log('no sockettt')
              return;
          }
          socketInstance.on(updateKey, (message:MessageWithMemberWithUser) => {
              queryClient.setQueryData([queryKey], (oldData:any) => {
                  if(!oldData || !oldData.pages || oldData.pages.length === 0) {
                      return oldData;
                  }
  
                  const newData = oldData.pages.map((page: any) => {
                      return {
                          ...page,
                          items: page.items.map((item:MessageWithMemberWithUser) => {
                              if(item.id === message.id) {
                                  return message
                              }
                              return item;
                          })
                          
                      }
                  })
                  console.log(`UPDATE MESSAGE: ${updateKey}`,{ message, newData})
                  return {
                      ...oldData,
                      pages: newData
                  }
              })
          })
  
          socketInstance.on(addKey, (message:MessageWithMemberWithUser) => {
              queryClient.setQueryData([queryKey], (oldData:any) => {
                  if(!oldData || !oldData.pages || oldData.pages.length === 0) {
                      return oldData;
                  }
  
                  const newData = [...oldData.pages]
  
                  newData[0] = {
                      ...newData[0],
                      items: [
                          message,
                          ...newData[0].items
                      ]
                  }
  
                  console.log(`NEW MESSAGE: ${addKey}`, {message, newData})
  
                  return {
                      ...oldData,
                      pages:newData
                  }
              })
          })
  
          return () => {
              socketInstance.off(addKey)
              socketInstance.off(updateKey)
          }
      }, [queryClient, addKey, queryKey, updateKey])


  if (status === "loading") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 ext-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading message...
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="h-7 w-7 ext-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong...
        </p>
      </div>
    );
  }
  return (
    <div className="flex-1 flex flex-col py-4 overflow-y-auto">
      <div className="flex-1" />
      <ChatWelcome type={type} name={name} />
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages.map((group, index) => {
          return (
            <React.Fragment key={index}>
              {group.items.map((message: MessageWithMemberWithUser) => (
                <ChatItem
                  currentMember={member}
                  member={message.member}
                  key={message.id}
                  id={message.id}
                  content={message.content}
                  fileUrl={message.fileUrl}
                  deleted={message.deleted}
                  timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                  isUpdated={message.updatedAt !== message.createdAt}
                  socketUrl={socketUrl}
                  socketQuery={socketQuery}
                />
              ))}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ChatMessages;
