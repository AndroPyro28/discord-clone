"use client"
import { useParams } from 'next/navigation'
import React from 'react'
 
 const page = () => {
    const {memberId, serverId} = useParams()
   return (
     <div>Server {serverId} with member {memberId} </div>
   )
 }
 
 export default page