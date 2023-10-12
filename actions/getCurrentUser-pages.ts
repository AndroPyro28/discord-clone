import { NextResponse } from "next/server";
import getSession from "./getSession";
import prismaDB from "@/lib/db";
import { getCsrfToken } from "next-auth/react";
import { NextApiRequest } from "next";
import { getServerSession } from "next-auth";
import { NextApiResponseServerIo } from "@/types";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export type TGetCurrentUser = Awaited<ReturnType<typeof getCurrentUserPages>>;

async function getCurrentUserPages(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  const currentUser = await getServerSession(req, res, authOptions);
  
  const user = await prismaDB.user.findUnique({
    where: {
      email: currentUser?.user?.email as string,
    },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      channels: true,
      members: true,
      servers: true,
      profile: true,
    },
  });
  return user;
}

export default getCurrentUserPages;
