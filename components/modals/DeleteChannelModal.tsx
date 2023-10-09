"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { mutate } from "@/hooks/useQueryProcessor";
import { Channel, Server } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";

const DeleteChannelModal = () => {
  const { isOpen, type, onClose, data } = useModal();
  const { server, channel } = data;
  const isModalOpen = isOpen && type === "deleteChannel";
  const router = useRouter()

  const deleteChannel = mutate<null, Channel>(
    `/channels/${channel?.id}?serverId=${server?.id}`,
    "DELETE",
    ["delete", "channel", channel?.id,],
    {
      enabled: typeof server?.id !== "undefined" && typeof channel?.id !== "undefined",
    }
  );

const onCancel = () => {
  onClose()
}
const onConfirm = async () => {
  try {
    deleteChannel.mutate(null, {
        onSuccess() {
          toast.success(`'#${channel?.name}' has been deleted`);
          onClose()
          router.refresh()
          router.push(`/servers/${server?.id}`)
        },
        onError() {
          toast.error(`Something went wrong...`)
        }
      });
  } catch (error) {
    console.error(error)
  }
}

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete Channel
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this?
            <br />
            <span className="text-indigo-500 font-semibold">{channel?.name}</span> will be permanent deleted
          </DialogDescription>
        </DialogHeader>
          <DialogFooter className="bg-gray-100 px-6 py-4 ">
            <div className="flex items-center justify-between w-full">
              <Button className="" disabled={deleteChannel.isLoading} onClick={onCancel} variant={'ghost'}>Cancel</Button>
              <Button className="" disabled={deleteChannel.isLoading} onClick={onConfirm} variant={'primary'}>Confirm</Button>
            </div>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteChannelModal;
