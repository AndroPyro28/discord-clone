"use client"
import { UploadDropzone } from '@/utils/uploadthing';
import React from 'react'
import { X } from 'lucide-react';
import Image from 'next/image';
import { mutate } from '@/hooks/useQueryProcessor';
import { useRouter } from 'next/navigation';

type FileUploadProps = {
    endpoint: 'messageFile'| 'serverImage' | 'deleteImage';
    onChange: (url?: string) => void;
    value: string
}

const FileUpload: React.FC<FileUploadProps> = ({
  onChange, value, endpoint
}) => {
  const deleteFile = mutate<string, null>(`/upload-thing-delete/`, 'POST', ['delete','uploadthing'],{
    enabled: value != ""
  })

  const router = useRouter();


  const fileType = value.split('.').pop()

  if(value && fileType !== 'pdf') {
    return <div className='relative h-20 w-20'>
      <Image fill src={value} alt="Uploaded server image" className='rounded-full object-cover' />
      <button onClick={() => {
        onChange("")
        if(value) {
          console.log('from delete iffff',)
          deleteFile.mutate(value.replaceAll('https://utfs.io/f/', ''), {
            onSettled: () => {
              router.refresh()
            }
          })
        }
    }} className='bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm' type='button'><X className='h-4 w-4' /></button>
    </div>
  }

  return (
    <UploadDropzone 
    endpoint={endpoint} 
    onClientUploadComplete={(res) => { 
      onChange(res?.[0].url)
    }}
    onUploadError={(err) => {
      console.error(`onUploadError: ${err}`)
    }}
    />
  )
}

export default FileUpload