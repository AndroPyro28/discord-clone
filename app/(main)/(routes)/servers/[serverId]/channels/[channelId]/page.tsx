"use client"
import { useParams } from 'next/navigation'
import React from 'react'
 
 const page = () => {
    const {channelId, serverId} = useParams()
   return (
     <div>Server {serverId} with channel {channelId}</div>
   )
 }
 
 export default page