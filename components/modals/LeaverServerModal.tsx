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
import { Server } from "@prisma/client";
import { useRouter } from "next/navigation";

const LeaveServerModal = () => {
  const { isOpen, type, onClose, data } = useModal();
  const { server } = data;
  const isModalOpen = isOpen && type === "leaveServer";
  const router = useRouter()
  const leaveServer = mutate<null, Server>(
    `/servers/${server?.id}/leave`,
    "PATCH",
    ["patch", "server", server?.id, "leave"],
    {
      enabled: typeof server?.id !== "undefined",
    }
  );

const onCancel = () => {
  onClose()
}
const onConfirm = async () => {
  try {
      leaveServer.mutate(null, {
        onSuccess() {
          toast.success(`You left '${server?.name}'`);
          onClose()
          router.refresh()
          router.push('/')
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
            Leave Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to leave <span className="font-semibold text-indigo-500">{server?.name}</span>
          </DialogDescription>
        </DialogHeader>
          <DialogFooter className="bg-gray-100 px-6 py-4 ">
            <div className="flex items-center justify-between w-full">
              <Button className="" disabled={leaveServer.isLoading} onClick={onCancel} variant={'ghost'}>Cancel</Button>
              <Button className="" disabled={leaveServer.isLoading} onClick={onConfirm} variant={'primary'}>Confirm</Button>
            </div>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveServerModal;
