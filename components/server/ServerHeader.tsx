"use client"
import { ServerWithMembersWithUsers } from "@/types";
import { ChannelType, MemberRole } from "@prisma/client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
import {type ModalType} from '@/hooks/use-modal-store'

type ServerHeaderProps = {
  server: ServerWithMembersWithUsers;
  role?: MemberRole;
};
const ServerHeader: React.FC<ServerHeaderProps> = ({ role, server }) => {
  const {onOpen,  } = useModal()
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  const handleOpen = (modalType: ModalType) => {
    onOpen(modalType, {server})
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none " asChild>
        <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition ">
          {server.name}
          <ChevronDown className="h-5 w-5 ml-auto" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">

        {isModerator && (
          <DropdownMenuItem className="text-indigo-600 dark:text-indigo-300 px-3 py-2 text-sm cursor-pointer"  onClick={() => handleOpen('invite')}>
            Invite People
            <UserPlus className="h-4 w-4 ml-auto"/>
          </DropdownMenuItem>
        )}

        {isAdmin && (
          <DropdownMenuItem className="text-indigo-600 dark:text-indigo-300 px-3 py-2 text-sm cursor-pointer" onClick={() => handleOpen('editServer')}>
            Server Settings
            <Settings className="h-4 w-4 ml-auto"/>
          </DropdownMenuItem>
        )}

        {isAdmin && (
          <DropdownMenuItem className="text-indigo-600 dark:text-indigo-300 px-3 py-2 text-sm cursor-pointer" onClick={() => handleOpen('members')}>
            Manage Members
            <Users className="h-4 w-4 ml-auto"/>
          </DropdownMenuItem>
        )}

        {isModerator && (
          <DropdownMenuItem className="text-indigo-600 dark:text-indigo-300 px-3 py-2 text-sm cursor-pointer" onClick={() => handleOpen('createChannel')}>
            Create Channel
            <PlusCircle className="h-4 w-4 ml-auto"/>
          </DropdownMenuItem>
        )}

      {isModerator && <DropdownMenuSeparator />}

      {isAdmin && (
          <DropdownMenuItem className="text-rose-500 px-3 py-2 text-sm cursor-pointer" onClick={() => handleOpen('deleteServer')}>
            Delete Server
            <Trash className="h-4 w-4 ml-auto"/>
          </DropdownMenuItem>
        )}

        {!isAdmin && (
          <DropdownMenuItem className="text-rose-500 px-3 py-2 text-sm cursor-pointer" onClick={() => handleOpen('leaveServer')}>
            Leave Server
            <LogOut className="h-4 w-4 ml-auto"/>
          </DropdownMenuItem>
        )}

      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServerHeader;
