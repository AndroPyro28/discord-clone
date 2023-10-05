import getCurrentUser from "@/actions/getCurrentUser";
import {v4 as uuid} from 'uuid'
import prismaDB from "@/lib/db";
import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";
import { z } from "zod";

const formSchema = z.object({
    name: z.string().min(1, {
      message: 'Server name is required'
    }),
    imageUrl: z.string().min(1, {
      message: 'Server image is Required'
    })
  })
  
type formType = z.infer<typeof formSchema>;

export async function POST(req:Request) {
    try {
        const {name, imageUrl} = await req.json() as formType
        const currentUser = await getCurrentUser()
        if(!formSchema.safeParse({name, imageUrl}).success) {
            return new NextResponse("missing info", { status: 400 });
        }

        const server = await prismaDB.server.create({
            data: {
                name,
                imageUrl,
                inviteCode: uuid(),
                channels: {
                    create: {
                        name: 'general',
                        user: {
                            connect: {
                                id: currentUser?.id
                            }
                        }
                    }
                },
                user: {
                    connect: {
                        id: currentUser?.id
                    }
                },
                members: {
                    create: {
                        user: {
                            connect:{
                                id: currentUser?.id,
                            },
                        },
                        role: MemberRole.ADMIN
                    }
                }
            }
        })

        return NextResponse.json(server)
    } catch (error) {
        console.error('[SERVERS_POST]', error)
        return new NextResponse('Internal Error', {status: 500, })
    }
}