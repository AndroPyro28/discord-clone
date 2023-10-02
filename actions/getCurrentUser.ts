import { NextResponse } from 'next/server'
import getSession from './getSession'
import prismaDB from '@/lib/db'
import { redirect } from 'next/navigation'

export type TGetCurrentUser= Awaited<ReturnType<typeof getCurrentUser>>

async function getCurrentUser() {
    const currentUser = await getSession()
    
    if(!currentUser?.user?.email) {
        return redirect('/login?error=You are unauthorized')
    }

   const user = await prismaDB.user.findUnique({
        where: {
            email: currentUser?.user?.email as string
        },
        select: {
            id: true,
            name:true,
            email:true,
            emailVerified:true,
            image:true,
            createdAt:true,
            updatedAt:true,
            channels: true,
            members: true,
            servers: true,
            profile: true
        },
    })
    return user
}

export default getCurrentUser