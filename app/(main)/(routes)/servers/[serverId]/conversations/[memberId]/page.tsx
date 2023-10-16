import getOrCreateConversation from "@/actions/conversation";
import getCurrentUser from "@/actions/getCurrentUser";
import MediaRoom from "@/components/MediaRoom";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessages from "@/components/chat/ChatMessages";
import prismaDB from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";

type MemberIdPageProps = {
  params: {
    memberId: string;
    serverId: string;
  };
  searchParams: {
    video?: boolean;
  };
};
const MemberIdPage: React.FC<MemberIdPageProps> = async ({
  params: { serverId, memberId },
  searchParams: { video },
}) => {
  const currentUser = await getCurrentUser();

  const currentMember = await prismaDB.member.findFirst({
    where: {
      serverId,
      userId: currentUser?.id,
    },
    include: {
      user: true,
    },
  });

  if (!currentMember) {
    return redirect("/");
  }

  const conversation = await getOrCreateConversation(
    currentMember.id,
    memberId
  );

  if (!conversation) {
    return redirect(`/servers/${serverId}`);
  }
  const { memberOne, memberTwo } = conversation;
  // if currentUser is the memberOne then we will get the memberTwo which is the otherMember
  const otherMember =
    memberOne.userId === currentUser?.id ? memberTwo : memberOne;
  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full ">
      <ChatHeader
        serverId={serverId}
        imageUrl={otherMember.user.image!}
        name={otherMember.user.name!}
        type={"conversation"}
        key={otherMember.id}
      />

      {(() => {
        if (!video) {
          return (
            <>
              <ChatMessages
                member={currentMember}
                name={otherMember.user.name as string}
                chatId={conversation.id}
                type="conversation"
                apiUrl="/api/direct-messages"
                paramKey="conversationId"
                paramValue={conversation.id}
                socketUrl="/api/socket/direct-messages"
                socketQuery={{
                  conversationId: conversation.id,
                }}
              />
              <ChatInput
                name={otherMember.user.name as string}
                type="conversation"
                apiUrl="/api/socket/direct-messages"
                query={{
                  conversationId: conversation.id,
                }}
              />
            </>
          );
        } else {
          return (
            <MediaRoom chatId={conversation.id} video={true} audio={true} />
          );
        }
      })()}
    </div>
  );
};

export default MemberIdPage;
