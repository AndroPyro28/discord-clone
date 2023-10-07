"use client";
import { cn } from "@/lib/utils";
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";
import { Hash, Mic, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";

type ServerChannelProps = {
  channel: Channel;
  server: Server;
  role?: MemberRole;
};

// const iconMap = {
//   [ChannelType.TEXT]: <Hash />,
//   [ChannelType.AUDIO]: <Mic />,
//   [ChannelType.VIDEO]: <Video />,
// };

const channelIconMap = {
    [ChannelType.TEXT]: Hash,
    [ChannelType.AUDIO]: Mic,
    [ChannelType.VIDEO]: Video,
  };

const ServerChannel: React.FC<ServerChannelProps> = ({ channel }) => {

  const params = useParams();
  const router = useRouter();

  const Icon = channelIconMap[channel.type];

  return (
    <button
      onClick={() => {}}
      className={cn(
        `group px-2 py-2 rounded-md flex items-center gap-x-2 w-full  hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1`
      )}
    >
       <Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
    </button>
  );
};

export default ServerChannel;
