import React from 'react'
import { IconType } from "react-icons"

type AuthSocialButtonProps = {
  icon: IconType,
  onClick: () => void;
  socialName?: string
}
function AuthSocialButton({onClick, icon:Icon, socialName}: AuthSocialButtonProps) {
  return (
    <button type='button' onClick={onClick}
    className='flex
    w-full
    items-center
    justify-center
    rounded-md
    px-4
    py-3
    text-white
    shadow-sm
    ring-1
    ring-inset
    gap-3
    ring-gray-300
    hover:bg-gray-50
    transition-all
    hover:text-black
    focus:outline-offset-0
    '
    >
        <Icon size={18} /> <span className='capitalize'>{socialName}</span> 
    </button>
  )
}

export default AuthSocialButton