"use client";
import { ServerWithMembersWithUsers } from "@/types";
import { ChannelType, MemberRole } from "@prisma/client";
import React from "react";
import ActionTooltip from "../ActionTooltip";
import { Plus, Settings } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

type ServerSectionProps = {
  label?: string;
  role?: MemberRole;
  sectionType: "channels" | "members";
  channelType?: ChannelType;
  server?: ServerWithMembersWithUsers;
};

const ServerSection: React.FC<ServerSectionProps> = ({
  label,
  role,
  sectionType,
  channelType,
  server,
}) => {
  const { onOpen } = useModal();

  return (
    <div className="flex items-center justify-between py-2 ">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {role != MemberRole.GUEST && sectionType === "channels" && (
        <ActionTooltip label={"Create channel"} side="top">
          <button
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            onClick={() => onOpen("createChannel", {
              channelType
            })}
          >
            <Plus className="h-4 w-4 " />
          </button>
        </ActionTooltip>
      )}

      {role == MemberRole.ADMIN && sectionType === "members" && (
        <ActionTooltip label={"Manage members"} side="top">
          <button
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            onClick={() => onOpen("members",{
              server
            })}
          >
            <Settings className="h-4 w-4 " />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};

export default ServerSection;
