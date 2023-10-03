"use client"
import { LogOutIcon } from 'lucide-react'
import { signOut } from 'next-auth/react'
import React from 'react'

const LogoutButton = () => {
  return (
    <button className="p-2 rounded-md" onClick={() => void signOut()}><LogOutIcon className="text-rose-600 " /></button>
  )
}

export default LogoutButton