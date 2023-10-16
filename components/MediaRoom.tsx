"use client";
import React, { useState, useEffect } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { Channel } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";

type MediaRoomProps = {
  chatId: string;
  video: boolean;
  audio: boolean;
};

const MediaRoom: React.FC<MediaRoomProps> = ({ chatId, video, audio }) => {
  const { data: session, status } = useSession();
  const [token, setToken] = useState();
  const params = useParams()
    const router = useRouter()
    const onLeave = () => {
        router.push(`/servers/${params?.serverId}`)
    }
  useEffect(() => {
    if (!session?.user.id || status != "authenticated") return;

    (async () => {
      try {
        const res = await fetch(
          `/api/livekit?room=${chatId}&username=${session.user.name}`
        );
        const data = await res.json();

        setToken(data.token);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [
    session?.user.name,
    session?.user.id,
    session?.user.email,
    session?.user.accessToken,
    chatId,
    status,
  ]);

  if (token === "") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">loading...</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      onDisconnected={onLeave}
      video={video}
      audio={audio}
      style={{ height: '95dvh' }}
    >
      <VideoConference />
    </LiveKitRoom>
  );
};

export default MediaRoom;
