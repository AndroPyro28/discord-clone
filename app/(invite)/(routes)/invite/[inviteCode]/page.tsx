import getCurrentUser from '@/actions/getCurrentUser';
import prismaDB from '@/lib/db';
import { redirect } from 'next/navigation';
import React from 'react'

type InviteCodePageProps = {
  params: {
    inviteCode: string;
  }
}

const InviteCodePage:React.FC<InviteCodePageProps> = async ({params:{inviteCode}}) => {
  const currentUser = await getCurrentUser();

  if(!inviteCode) {
    return redirect('/')
  }

  const existingServer = await prismaDB.server.findFirst({
    where:{
      inviteCode,
      members: {
        some: {
          userId: currentUser?.id
        }
      }
    }
  })

  if(existingServer) {
    return redirect(`/servers/${existingServer.id}`)
  }

  const server = await prismaDB.server.update({
    where:{
      inviteCode
    },
    data: {
      members:{
        create: [
          {
            userId: currentUser?.id!
          }
        ]
      }
    }
  })

  if(server) {
    return redirect(`/servers/${server.id}`)
  }

  return (
    <div>hello invite</div>
  )
}

export default InviteCodePage