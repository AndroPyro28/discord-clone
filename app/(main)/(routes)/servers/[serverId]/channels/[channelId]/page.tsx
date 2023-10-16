import getCurrentUser from "@/actions/getCurrentUser";
import MediaRoom from "@/components/MediaRoom";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessages from "@/components/chat/ChatMessages";
import prismaDB from "@/lib/db";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";

type ChannelIdPageProps = {
  params: {
    serverId: string;
    channelId: string;
  };
};

const page: React.FC<ChannelIdPageProps> = async ({
  params: { serverId, channelId },
}) => {
  const currentUser = await getCurrentUser();
  const channel = await prismaDB.channel.findUnique({
    where: {
      id: channelId,
    },
  });

  const member = await prismaDB.member.findFirst({
    where: {
      serverId: serverId,
      userId: currentUser?.id,
    },
  });

  if (!channel || !member) {
    return redirect(`/`);
  }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full ">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
      />

      {
      (() => {
        if (channel.type === ChannelType.TEXT) {
          return (
            <>
              <ChatMessages
                member={member}
                name={channel.name}
                type="channel"
                apiUrl="/api/messages"
                socketUrl="/api/socket/messages"
                socketQuery={{
                  channelId: channel.id,
                  serverId: channel.serverId,
                }}
                paramKey="channelId"
                paramValue={channel.id}
                chatId={channel.id}
              />
              <ChatInput
                name={channel.name}
                apiUrl="/api/socket/messages"
                type="channel"
                query={{
                  channelId: channel.id,
                  serverId: serverId,
                }}
              />
            </>
          );
        } else if (channel.type === ChannelType.AUDIO) {
          return (
            <>
              <MediaRoom chatId={channel.id} video={false} audio={true} />
            </>
          );
        } else if (channel.type === ChannelType.VIDEO) {
          return (
            <>
              <MediaRoom chatId={channel.id} video={true} audio={true} />
            </>
          );
        } else {
          return null;
        }
      })()
      }
    </div>
  );
};

export default page;
