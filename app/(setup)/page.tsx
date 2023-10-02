import getCurrentUser from '@/actions/getCurrentUser'
import InitialModal from '@/components/modals/InitialModal';
import prismaDB from '@/lib/db';
import { redirect } from 'next/navigation';
import React from 'react'

const page = async () => {
  
  const currentUser = await getCurrentUser();

  const server = await prismaDB.server.findFirst({
    where: {
      members: {
        some: {
          userId: currentUser?.id
        }
      }
    }
  })

  if(server) {
    return redirect(`/servers/${server.id}`)
  }
  
  return (  
    <InitialModal />
  )
}

export default page