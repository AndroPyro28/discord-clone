"use client";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ActionTooltipProps = {
  label: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
};

const ActionTooltip: React.FC<ActionTooltipProps> = ({
  label,
  children,
  side,
  align,
}) => {
  return <TooltipProvider>
    <Tooltip delayDuration={50}>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent side={side} align={align}>
        <p className="font-semibold text-sm capitalize">{label.toLocaleLowerCase()}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>;
};

export default ActionTooltip;
