"use client"
import { signOut } from 'next-auth/react'
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'

const ServerId = () => {
  const {serverId} = useParams()
  // useEffect(() => {
  //   void signOut()
  // }, [])
  return (
    <div>Server ID {serverId}</div>
  )
}

export default ServerId