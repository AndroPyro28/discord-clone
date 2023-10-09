import getCurrentUser from "@/actions/getCurrentUser";
import prismaDB from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, {params}: {params: {channelId: string}}) {
  try {
    const currentUser = await getCurrentUser();
    const { searchParams } = new URL(req.url);
    const {channelId} = params
    const serverId = searchParams.get("serverId");

    if (!serverId) {
      return new NextResponse("Missing server ID", { status: 400 });
    }

    if (!channelId) {
        return new NextResponse("Missing channel ID", { status: 400 });
      }

    const server = await prismaDB.server.update({
         where: {
            id: serverId,
            members: {
                some: {
                    userId: currentUser?.id,
                    role: {
                        in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                    }
                }
            },
         },
         data: {
            channels: {
                delete: {
                    id: channelId,
                    name: {
                        not: 'general'
                    }
                }
            }
         }
    });

    return NextResponse.json(server);
  } catch (error) {
    console.error(`[DELETE:CHANNEL_ID]`);
    return new NextResponse("Interal Error", { status: 500 });
  }
}

export async function PATCH(req: Request, {params}: {params: {channelId: string}}) {
  try {
    const currentUser = await getCurrentUser();
    const { searchParams } = new URL(req.url);
    const {name, type} = await req.json()
    const {channelId} = params
    const serverId = searchParams.get("serverId");

    if (!serverId) {
      return new NextResponse("Missing server ID", { status: 400 });
    }

    if (!channelId) {
        return new NextResponse("Missing channel ID", { status: 400 });
      }

      if(name === 'general') {
        return new NextResponse("Name cannot be 'general'", {status:400})
      }

    const server = await prismaDB.server.update({
         where: {
            id: serverId,
            members: {
                some: {
                    userId: currentUser?.id,
                    role: {
                        in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                    }
                }
            },
         },
         data: {
            channels: {
              update:{
                where: {
                  id: channelId,
                  name: {
                    not: 'general'
                  },
                },
                data: {
                  name,
                  type
                }
              }
            }
         }
    });

    return NextResponse.json(server);
  } catch (error) {
    console.error(`[PATCH:CHANNEL_ID]`);
    return new NextResponse("Interal Error", { status: 500 });
  }
}

