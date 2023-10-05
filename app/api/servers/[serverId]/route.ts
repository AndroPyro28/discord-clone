import getCurrentUser from "@/actions/getCurrentUser"
import prismaDB from "@/lib/db";
import { NextResponse } from "next/server"
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

export async function PATCH (request: Request, {params}: {params: {serverId: string}}) {
    try {
        const currentUser = await getCurrentUser();
        const {name, imageUrl} = await request.json() as formType

        if(!formSchema.safeParse({name, imageUrl}).success) {
            return new NextResponse("missing info", { status: 400 });
        }

        const server = await prismaDB.server.update({
            where:{
                id: params?.serverId
            },
            data:{
                name,
                imageUrl
            }
        });

        return NextResponse.json(server);
        
    } catch (error) {
        console.error(`[PATCH:SERVER_ID]`,error)

        return new NextResponse('Internal error', {status:500})
    }
}