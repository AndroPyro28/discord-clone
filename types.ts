import { Channel, Member, Server, User } from "@prisma/client";

export type ServerWithMembersWithUsers = Server & {
    members: (Member & {
        user: User
    })[];
    channels: Channel[]
}