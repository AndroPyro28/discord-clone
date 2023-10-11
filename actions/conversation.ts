import prismaDB from "@/lib/db";

const findConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    return await prismaDB.conversation.findFirst({
      where: {
        AND: [{ memberOneId }, { memberTwoId }],
      },
      include: {
        memberOne: {
          include: {
            user: true,
          },
        },
        memberTwo: {
          include: {
            user: true,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};

const createNewConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  try {
    return await prismaDB.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            user: true,
          },
        },
        memberTwo: {
          include: {
            user: true,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};

 const getOrCreateConversation = async (memberOneId:string, memberTwoId: string) => {
    let conversation = await findConversation(memberOneId, memberTwoId) || await findConversation(memberTwoId, memberOneId)

    if(!conversation) {
        conversation = await createNewConversation(memberOneId, memberTwoId)
    }
    return conversation;
}

export default getOrCreateConversation