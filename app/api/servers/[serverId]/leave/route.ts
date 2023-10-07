import getCurrentUser from "@/actions/getCurrentUser"
import prismaDB from "@/lib/db";
import { NextResponse } from "next/server"
import { v4 as uuid } from "uuid";

export async function PATCH (request: Request, {params}: {params: {serverId: string}}) {
    try {
        const currentUser = await getCurrentUser();

        if(!params?.serverId) {
            return new NextResponse('Server ID Missing', {status: 400})
        }

        const server = await prismaDB.server.update({
            where: {
                id: params?.serverId,
                // if the userId which is the person who created this server AKA ADMIN is not equals to currentUser then he can leave the server
                userId: {
                    not: currentUser?.id
                },
                members: {
                    some: {
                        userId: currentUser?.id
                    }
                }
            },
            data: {
                members: {
                    deleteMany: {
                        userId: currentUser?.id as string,
                    }
                }
            }
        })

        return NextResponse.json(server, {status: 200});

    } catch (error) {
        console.error(`[PATCH:SERVER_ID_LEAVE]`,error)
        return new NextResponse('Internal error', {status:500})
    }
}