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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, CheckIcon, Copy, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/useOrigin";
import { useState } from "react";
import toast from "react-hot-toast";
import { mutate, query } from "@/hooks/useQueryProcessor";
import { Server } from "@prisma/client";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

const InviteModal = () => {
  const { isOpen, onOpen, type, onClose, data } = useModal();
  const { server } = data;
  const origin = useOrigin();
  const isModalOpen = isOpen && type === "invite";

  const [copied, setCopied] = useState(false);

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(() => true);
    toast.success("Invite url has been copied!");
    setTimeout(() => {
      setCopied(() => false);
    }, 1000);
  };
  const updateInviteCode = mutate<null, Server>(
    `/servers/${server?.id}/invite-code`,
    "PATCH",
    ["patch", "server", server?.id, "invite-code"],
    {
      enabled: typeof server?.id !== "undefined",
    }
  );
  const onGenerateNewLink = async () => {
    try {
      updateInviteCode.mutate(null, {
        // i always forgot to update here
        onSuccess(data, variables, context) {
          onOpen("invite", { server: data });
        },
      });
    } catch (error) {
    } finally {
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Invite Friends
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
            Server Invite Link
          </Label>

          <div className="flex items-center mt-2 gap-x-2">
            <Input
              readOnly
              disabled={updateInviteCode.isLoading}
              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
              value={inviteUrl}
            />
            <Button
              disabled={updateInviteCode.isLoading}
              size={"icon"}
              onClick={onCopy}
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          <Button
            onClick={onGenerateNewLink}
            disabled={updateInviteCode.isLoading}
            variant={"link"}
            size={"sm"}
            className="text-xs text-zinc-500 mt-4"
          >
            Generate a new link <RefreshCw className={cn(`w-4 h-4 ml-2`, updateInviteCode.isLoading && 'animate-spin')} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;
