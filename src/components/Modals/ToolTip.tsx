import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ReactNode } from "react";

export function ToolTip({ children, content, isDanger=false }: { children: ReactNode, content: string, isDanger?: boolean}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className={`${isDanger ? "bg-red-500 !py-1 " : "dark:bg-[#2a2a2a] !py-1 "}`}>
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
