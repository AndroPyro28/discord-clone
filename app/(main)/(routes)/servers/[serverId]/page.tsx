import getCurrentUser from '@/actions/getCurrentUser'
import prismaDB from '@/lib/db'
import { signOut } from 'next-auth/react'
import { redirect, useParams } from 'next/navigation'
import React, { useEffect } from 'react'

type ServerIdProps = {
  params: {
    serverId: string
  }
}
const ServerId:React.FC<ServerIdProps> = async ({params: {serverId}}) => {

  const currentUser = await getCurrentUser();

  const server = await prismaDB.server.findUnique({
    where: {
      id:serverId,
      members: {
        some: {
          userId: currentUser?.id
        }
      },
    },
    include: {
      channels:{
        where:{
          name: 'general'
        },
        orderBy: {
          createdAt: 'asc'
        }
      },
    }
  })

  const initialChannel = server?.channels[0];

  if(initialChannel?.name != 'general') {
    return null;
  }

  return redirect(`/servers/${serverId}/channels/${initialChannel?.id}`)
}

export default ServerId