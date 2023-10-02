import React from 'react'
import getCurrentUser from './getCurrentUser';
import prismaDB from '@/lib/db';

const getServers = async () => {
    const currentUser = await getCurrentUser();
  
    const servers = await prismaDB.server.findMany({
      where:{ 
        members: {
          some: {
           userId: currentUser?.id
          }
        }
      }
    })

    return servers
}

export default getServers