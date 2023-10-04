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
                userId: currentUser?.id
            },
             data: {
                inviteCode: uuid()
             }
        })

        return NextResponse.json(server, {status: 200});

    } catch (error) {
        console.error(`[PATCH:SERVER_ID_INVITE_CODE]`,error)
        return new NextResponse('Internal error', {status:500})
    }
}