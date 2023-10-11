import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import {Server as SocketIOServer} from 'socket.io'
import { Channel, Member, Server, User } from "@prisma/client";

export type ServerWithMembersWithUsers = Server & {
  members: (Member & {
    user: User;
  })[];
  channels: Channel[];
};

export type NextApiResponseServerIo = NextApiResponse & {
    socket: Socket & {
        server: NetServer & {
            io: SocketIOServer
        }
    }
}