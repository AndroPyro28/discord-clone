import getOrCreateConversation from "@/actions/conversation";
import getCurrentUser from "@/actions/getCurrentUser";
import ChatHeader from "@/components/chat/ChatHeader";
import prismaDB from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";

type MemberIdPageProps = {
  params: {
    memberId: string;
    serverId: string;
  };
};
const MemberIdPage: React.FC<MemberIdPageProps> = async ({
  params: { serverId, memberId },
}) => {
  const currentUser = await getCurrentUser();

  const currentMember = await prismaDB.member.findFirst({
    where:{
      serverId,
      userId: currentUser?.id
    },
    include: {
      user: true
    }
  });

  if(!currentMember) {
    return redirect('/')
  }

  const conversation = await getOrCreateConversation(currentMember.id, memberId);

  if(!conversation) {
    return redirect(`/servers/${serverId}`);
  }
  const {memberOne, memberTwo} = conversation;
  // if currentUser is the memberOne then we will get the memberTwo which is the otherMember
  const otherMember = memberOne.userId === currentUser?.id  ? memberTwo : memberOne;  
  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full ">
      <ChatHeader serverId={serverId} imageUrl={otherMember.user.image!} name={otherMember.user.name!} type={'conversation'} key={otherMember.id}/>
    </div>
  );
};

export default MemberIdPage;
