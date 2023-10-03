import React from "react";
import getCurrentUser from "./getCurrentUser";
import prismaDB from "@/lib/db";
import { redirect } from "next/navigation";

const getServerById = async (serverId: string) => {
  const currentUser = await getCurrentUser();

  const server= await prismaDB.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          userId: currentUser?.id,
        },
      },
    },
  });

  if(!server) return redirect('/');

  return server;
};

export default getServerById;
