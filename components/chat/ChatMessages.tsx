"use client";
import { Member, Message, User } from "@prisma/client";
import React, { ElementRef, useEffect, useRef } from "react";
import ChatWelcome from "./ChatWelcome";
import useChatQuery from "@/hooks/useChatQuery";
import { Loader2, ServerCrash } from "lucide-react";
import ChatItem from "./ChatItem";
import { format } from "date-fns";
import { useChatSocket } from "@/hooks/useChatSocket";
import { useRouter } from "next/navigation";
import { io as ClientIO } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { useChatScroll } from "@/hooks/useChatScroll";
import MediaRoom from "../MediaRoom";

const DATE_FORMAT = `d MMM yyyy, HH:mm`;

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
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;
  const router = useRouter();

  const {
    fetchNextPage,
    hasNextPage,
    data,
    isFetchingNextPage,
    status,
    refetch,
  } = useChatQuery({ queryKey, paramKey, paramValue, apiUrl });

  
  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);

  useChatSocket({ queryKey, addKey, updateKey });
  useChatScroll({
    chatRef, 
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count:data?.pages[0]?.items.length ?? 0,
  })


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
    <div className="flex-1 flex flex-col py-4 overflow-y-auto" ref={chatRef}>
      {(() => {
        if (!hasNextPage)
          return (
            <>
              <div className="flex-1" />
              <ChatWelcome type={type} name={name} />
            </>
          );

        return null;
      })()}

      {(() => {
        if (hasNextPage) {
          return (
            <div className="flex justify-center">
              {isFetchingNextPage ? (
                <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4" />
              ) : (
                <button
                  onClick={() => fetchNextPage()}
                  className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4  dark:hover:text-zinc-300 transition"
                >
                  load previous messages
                </button>
              )}
            </div>
          );
        }

        return null;
      })()}
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
                  type={type}
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
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
