"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { io as ClientIO } from "socket.io-client";

type SocketContextType = {
  socket: any | null;
  isConnected: boolean;
  setSocket: any
  setIsConnected:any

};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  setSocket: null,
  setIsConnected: null
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketIoProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const router = useRouter()

  useEffect(() => {
    // const socketInstance = new (ClientIO as any)(
    //   process.env.NEXT_PUBLIC_SITE_URL!,
    //   { path: "/api/socket/io", addTrailingSlash: false }
    // );

    // socketInstance.on('connect', () => {
    //   console.log('connected')
    //     setIsConnected(true)
    // })
    
    // socketInstance.on('disconnect', () => {
    //   console.log('disconnected')
    //     setIsConnected(false)
    // })

    // setSocket(socketInstance)

    // return () => {
    //     socketInstance.disconnect()
    // }

  }, []);

  return <SocketContext.Provider value={{socket, isConnected, setSocket, setIsConnected}}>{children}</SocketContext.Provider>;
};
