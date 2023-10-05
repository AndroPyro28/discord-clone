import getCurrentUser from "@/actions/getCurrentUser"
import prismaDB from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server"
import { utapi } from "uploadthing/server";

export async function POST (request: Request, {params}: {params: {fileId: string}}) {
    try {
        const fileId = await request.json();
        const {success} = await utapi.deleteFiles([fileId])
        console.log('response:::::::')

        if(success) {
            const server = await prismaDB.server.updateMany({
                where: {
                    imageUrl: `https://utfs.io/f/${fileId}`
                }, 
                data: {
                    imageUrl: ''
                }
            })
            return NextResponse.json(server)
        }

        throw new Error('upload failed')

    } catch (error) {
        console.error(`[DELETE:UPLOADING_THING]`,error)
        return new NextResponse('Internal error', {status:500})
    }
}
