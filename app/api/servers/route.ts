import getCurrentUser from "@/actions/getCurrentUser";
import { formSchema, type formType } from "@/components/modals/InitialModal";
import prismaDB from "@/lib/db";
import { NextResponse } from "next/server";
export async function POST(req:Request) {
    try {
        const {name, imageUrl} = await req.json() as formType

        if(!formSchema.safeParse({name, imageUrl})) {

        }
        
    } catch (error) {
        console.error('[SERVERS_POST]', error)

        return new NextResponse('Internal Error', {status: 500, })
    }
}