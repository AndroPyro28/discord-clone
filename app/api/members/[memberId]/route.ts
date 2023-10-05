import getCurrentUser from "@/actions/getCurrentUser"
import prismaDB from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server"

export async function PATCH (request: Request, {params}: {params: {memberId: string}}) {
    try {
        const currentUser = await getCurrentUser()

        const {role} = await request.json() as {role: MemberRole}
        const {searchParams} = new URL(request.url)
        const serverId = searchParams.get('serverId');
        const {memberId} = params;

        if(!serverId) return new NextResponse('Server ID missing', {status:400})
        if(!memberId) return new NextResponse('Member ID missing', {status:400})

        const server = await prismaDB.server.update({
            where: {
                id:serverId,
                userId: currentUser?.id
            },
            data: {
            
                members: {
                    update: {
                        where: {
                            id: memberId,
                            userId: {
                                not: currentUser?.id!
                            },
                        },
                        data: {
                            role,
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        user: true
                    },
                    orderBy: {
                        role: 'asc'
                    }
                }
            }
        })

        return NextResponse.json(server, {status:200});

    } catch (error) {
        console.error(`[PATCH:MEMBER_ID]`,error)
        return new NextResponse('Internal error', {status:500})
    }
}