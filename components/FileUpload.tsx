"use client";
import { UploadDropzone } from "@/utils/uploadthing";
import React from "react";
import { FileIcon, X } from "lucide-react";
import Image from "next/image";
import { mutate } from "@/hooks/useQueryProcessor";
import { useRouter } from "next/navigation";

type FileUploadProps = {
  endpoint: "messageFile" | "serverImage";
  onChange: (url?: string) => void;
  value: string;
};

const FileUpload: React.FC<FileUploadProps> = ({
  onChange,
  value,
  endpoint,
}) => {
  const deleteFile = mutate<string, null>(
    `/upload-thing-delete/`,
    "POST",
    ["delete", "uploadthing"],
    {
      enabled: value != "",
    }
  );

  const router = useRouter();

  const fileType = value.split(".").pop();
  const fileTypeImg = ["jpg", "png", "webp"];
  const fileTypeVideo = ["mp4", "webm", "avi", "mkr", 'mkv'];
console.log(fileType)
  const handleDelete = () => {
    onChange("");
    if (value) {
      deleteFile.mutate(value.replaceAll("https://utfs.io/f/", ""), {
        onSettled: () => {
          router.refresh();
        },
      });
    }
  };
  if (value && fileTypeImg.includes(fileType as string)) {
    // if image type then we will display image
    return (
      <div className="relative h-20 w-20">
        <Image
          fill
          src={value}
          alt="Uploaded server image"
          className="rounded-full object-cover"
        />
        <button
          onClick={handleDelete}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (value && fileTypeVideo.includes(fileType as string)) {
    // if video type then we will display image
    return (
      <div className="relative h-[100px] w-[200px]">
        <video src={value} controls className=" object-cover rounded-lg" />
        <button
          onClick={handleDelete}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (value && fileType === "pdf") {
    // if pdf type then we will display image
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <FileIcon className="h-10 w-10 fill-indigo-200" />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
        >
          {value}
        </a>
        <button
          onClick={handleDelete}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(err) => {
        console.error(`onUploadError: ${err}`);
      }}
    />
  );
};

export default FileUpload;