import { useSocket } from "@/components/providers/SocketIoProvider";
import { Member, User, Message } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { io as ClientIO } from "socket.io-client";

type ChatSocketProps = {
    addKey:string;
    updateKey:string;
    queryKey: string;
}
type MessageWithMemberWithUser = Message & {
    member:Member & {
        user:User
    }
}
export const useChatSocket = ({addKey, updateKey, queryKey}: ChatSocketProps) => {
    const queryClient = useQueryClient();

    useEffect(() => {
        const io = new (ClientIO as any)(
            process.env.NEXT_PUBLIC_SITE_URL!,
            { path: "/api/socket/io", addTrailingSlash: false }
          );

          io.on('connect', (socket:any) => {
            console.log('connected')
            socket?.on(updateKey, (message:MessageWithMemberWithUser) => {
                queryClient.setQueryData([queryKey], (oldData:any) => {
                    if(!oldData || !oldData.pages || oldData.pages.length === 0) {
                        return oldData;
                    }
    
                    const newData = oldData.pages.map((page: any) => {
                        return {
                            ...page,
                            items: page.items.map((item:MessageWithMemberWithUser) => {
                                if(item.id === message.id) {
                                    return message
                                }
                                return item;
                            })
                            
                        }
                    })
                    console.log(`UPDATE MESSAGE: ${updateKey}`,{ message, newData})
                    return {
                        ...oldData,
                        pages: newData
                    }
                })
            })
    
            socket?.on(addKey, (message:MessageWithMemberWithUser) => {
                queryClient.setQueryData([queryKey], (oldData:any) => {
                    if(!oldData || !oldData.pages || oldData.pages.length === 0) {
                        return oldData;
                    }
    
                    const newData = [...oldData.pages]
    
                    newData[0] = {
                        ...newData[0],
                        items: [
                            message,
                            ...newData[0].items
                        ]
                    }
    
                    console.log(`NEW MESSAGE: ${addKey}`, {message, newData})
    
                    return {
                        ...oldData,
                        pages:newData
                    }
                })
            })
            })

        return () => {
            io.disconnect()
        }

    }, [queryClient, addKey, queryKey, updateKey])
}