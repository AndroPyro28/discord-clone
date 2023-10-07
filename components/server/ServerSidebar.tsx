import getCurrentUser from "@/actions/getCurrentUser";
import prismaDB from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import ServerHeader from "./ServerHeader";
import { ScrollArea } from "../ui/scroll-area";
import ServerSearch from "./ServerSearch";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { Separator } from "../ui/separator";
import ServerSection from "./ServerSection";
import ServerChannel from "./ServerChannel";

type ServerSidebarProps = {
  serverId: string;
};

const channelIconMap = {
  [ChannelType.TEXT]: <Hash className={"mr-2 h-4 w-4"} />,
  [ChannelType.AUDIO]: <Mic className={"mr-2 h-4 w-4"} />,
  [ChannelType.VIDEO]: <Video className={"mr-2 h-4 w-4"} />,
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className={"mr-2 h-4 w-4 text-indigo-500"} />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className={"mr-2 h-4 w-4 text-rose-500"} />,
};
const ServerSidebar: React.FC<ServerSidebarProps> = async ({ serverId }) => {
  const currentUser = await getCurrentUser();

  const server = await prismaDB.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          user: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  const textChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const audioChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );
  const members = server?.members.filter(
    (member) => member.userId != currentUser?.id
  );

  if (!server) return redirect("/");

  const role = server.members.find(
    (member) => member.userId === currentUser?.id
  )?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5] ">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIconMap[channel.type],
                })),
              },
              {
                label: "Voice Channels",
                type: "channel",
                data: audioChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIconMap[channel.type],
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIconMap[channel.type],
                })),
              },
              {
                label: "Members",
                type: "member",
                data: members?.map((member) => ({
                  id: member?.id,
                  name: member?.user?.name as string,
                  icon: roleIconMap[member?.role],
                })),
              },
            ]}
          />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        {!!textChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType={"channels"}
              channelType={ChannelType.TEXT}
              role={role}
              label="Text Channels"
            />
            {textChannels?.map((channel) => {
              return <ServerChannel 
              key={channel.id}
              channel={channel}
              role={role}
              server={server}
              />
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;
