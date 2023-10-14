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
    const { serverId, channelId } = req.query;
    
    if (!currentUser) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!serverId) {
      return res.status(401).json({
        message: "Server ID missing",
      });
    }
    if (!channelId) {
      return res.status(401).json({
        message: "Channel ID missing",
      });
    }

    if (!content) {
      return res.status(401).json({
        message: "Content missing",
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

    const message = await prismaDB.message.create({
      data: {
        content,
        fileUrl,
        channelId: channelId as string,
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

    const channelKey = `chat:${channelId}:messages`;

    console.log("new message socket:", channelKey)
    res.socket?.server?.io.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.error(error);
    return res.status(405).json({
      message: "Internal error",
    });
  }
}
