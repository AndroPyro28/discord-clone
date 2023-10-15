import getCurrentUser from "@/actions/getCurrentUser";
import getCurrentUserPages from "@/actions/getCurrentUser-pages";
import prismaDB from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method is not allowed!",
    });
  }
  try {
    const currentUser = await getCurrentUserPages(req, res);
    const { content, fileUrl } = req.body;
    const { conversationId } = req.query;
    
    if (!currentUser) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!conversationId) {
      return res.status(401).json({
        message: "Channel ID missing",
      });
    }

    if (!content) {
      return res.status(401).json({
        message: "Content missing",
      });
    }

    const conversation = await  prismaDB.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              userId: currentUser?.id
            }
          },
          {
            memberTwo: {
              userId: currentUser?.id
            }
          }
        ]
      },
      include: {
        memberOne: {
          include:{
            user: true
          }
        },
        memberTwo: {
          include:{
            user: true
          }
        },
      }
    })

    if(!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    const member = conversation.memberOne.userId === currentUser.id ? conversation.memberOne : conversation.memberTwo

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    const message = await prismaDB.directMessage.create({
      data: {
        content,
        fileUrl,
        conversationId: conversationId as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            user: true,
          },
        },
      },
    });

    const conversationKey = `chat:${conversationId}:messages`;

    console.log("new message socket:", conversationKey)
    
    res.socket?.server?.io.emit(conversationKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.error("ERROR_DIRECT_MESSAGE_POST",error);
    return res.status(405).json({
      message: "Internal error",
    });
  }
}
