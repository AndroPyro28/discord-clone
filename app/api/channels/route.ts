import getCurrentUser from "@/actions/getCurrentUser";
import prismaDB from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import { profile } from "console";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const { name, type } = await req.json();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!serverId) {
      return new NextResponse("Missing server ID", { status: 400 });
    }

    if (name === "general") {
      return new NextResponse("Name cannot be 'general'", { status: 400 });
    }

    if (!type) {
        return new NextResponse("Type cannot be empty", { status: 400 });
      }

    const server = await prismaDB.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            userId: currentUser?.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            userId: currentUser?.id as string,
            name,
            type,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.error(`POST:CHANNEL`);
    return new NextResponse("Interal Error", { status: 500 });
  }
}
