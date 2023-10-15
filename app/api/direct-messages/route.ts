import getCurrentUser from "@/actions/getCurrentUser";
import prismaDB from "@/lib/db";
import { DirectMessage, Message } from "@prisma/client";
import { NextResponse } from "next/server";

const MESSAGE_BATCH = 10;

export async function GET(req: Request) {
  try {
    const currentProfile = await getCurrentUser();
    const {searchParams} = new URL(req.url);

    const cursor = searchParams.get('cursor');
    const conversationId = searchParams.get('conversationId');

    if(!conversationId) {
        return new NextResponse('Conversation ID missing', {status: 400})
    }

    let messages: DirectMessage[] = [];

    if(cursor) {
        messages = await prismaDB.directMessage.findMany({
            take: MESSAGE_BATCH,
            skip: 1,
            cursor: {
                id: cursor,
            },
            where: {
                conversationId,
            },
            include: {
                member:{
                    include: {
                        user: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
    }
    else {
        messages = await prismaDB.directMessage.findMany({
            take: MESSAGE_BATCH,
            where: {
                conversationId,
            },
            include: {
                member:{
                    include: {
                        user: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
    }

    let nextCursor = null;

    if(messages.length === MESSAGE_BATCH) {
        nextCursor = messages[MESSAGE_BATCH - 1].id
    }
    return NextResponse.json({
        items:messages,
        nextCursor
    })
  } catch (error) {
    console.error("[ERROR_DIRECT_MESSAGE_GET]:", error);
    return new NextResponse('Internal Error', {status: 500})
  }
}
