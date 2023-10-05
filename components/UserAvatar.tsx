import React from 'react'
import { Avatar, AvatarImage } from './ui/avatar'
import { cn } from '@/lib/utils';

type UserAvatarProps = React.ImgHTMLAttributes<HTMLImageElement>

const UserAvatar:React.FC<UserAvatarProps> = ({className, ...rest}) => {
  return (
    <Avatar className={cn(`h-7 w-7 md:h-10 md:w-10`, className)}>
        <AvatarImage {...rest} />
    </Avatar>
  )
}

export default UserAvatar