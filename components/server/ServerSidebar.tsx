import getCurrentUser from '@/actions/getCurrentUser';
import getServerById from '@/actions/getServerById';
import prismaDB from '@/lib/db';
import { ChannelType } from '@prisma/client';
import { redirect } from 'next/navigation';
import ServerHeader from './ServerHeader';

type ServerSidebarProps = {
    serverId: string
}

const ServerSidebar:React.FC<ServerSidebarProps> = async ({serverId}) => {

  const currentUser = await getCurrentUser();

  const server = await prismaDB.server.findUnique({
    where: {
      id: serverId,
    },
    include:{
      channels: {
        orderBy: {
          createdAt: 'asc'
        },
      },
      members: {
        include: {
          user: true
        },
        orderBy: {
            role: 'asc'
        }
      }
    }
  });

  const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT)
  const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO)
  const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO)
  const members = server?.members.filter((member) => member.userId != currentUser?.id)

  if(!server) return redirect("/")

  const role = server.members.find((member) => member.userId === currentUser?.id)?.role
  
  return (
    <div className='flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5] '>
      <ServerHeader server={server} role={role} />
    </div>
  )
}

export default ServerSidebar