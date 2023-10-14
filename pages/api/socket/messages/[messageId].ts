import getCurrentUserPages from "@/actions/getCurrentUser-pages";
import prismaDB from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { MemberRole } from "@prisma/client";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method != "DELETE" && req.method != "PATCH") {
    return res.status(405).json({
      message: "Method not allowed",
    });
  }

  try {
    const currentUser = await getCurrentUserPages(req, res);
    const { messageId, serverId, channelId } = req.query;
    const { content } = req.body;

    if (!currentUser) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!serverId) {
      return res.status(400).json({
        message: "Server ID missing",
      });
    }

    if (!channelId) {
      return res.status(400).json({
        message: "Channel ID missing",
      });
    }

    if (!messageId) {
      return res.status(400).json({
        message: "Message ID missing",
      });
    }

    const server = await prismaDB.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            userId: currentUser.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) {
      return res.status(404).json({
        message: "Server not found",
      });
    }

    const channel = await prismaDB.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });

    if (!channel) {
      return res.status(404).json({
        message: "Channel not found",
      });
    }

    const member = server.members.find(
      (member) => member.userId === currentUser.id
    );

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    let message = await prismaDB.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channelId as string,
      },
      include: {
        member: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!message || message.deleted) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    const isMessageOwner = message.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (req.method === "DELETE") {
      message = await prismaDB.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          fileUrl: null,
          content: "This message has been deleted.",
          deleted: true,
        },
        include: {
          member: {
            include: {
              user: true,
            },
          },
        },
      });
    }

    if (req.method === "PATCH") {
      if (!isMessageOwner) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }
      message = await prismaDB.message.update({
        where: {
          id: messageId as string,
        },
        data: { content },
        include: {
          member: {
            include: {
              user: true,
            },
          },
        },
      });
    }
    const updateKey = `chat:${channelId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, message);

    console.log("update message socket:", updateKey)

    return res.status(200).json(message);

  } catch (error) {
    console.error(`[MESSAGE_ID] ${error}`);
    return res.status(500).json({
      message: "Internal error",
    });
  }
}
