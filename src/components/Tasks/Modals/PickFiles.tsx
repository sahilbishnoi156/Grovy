import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAppStore } from "@/store/store";
import { FileType } from "@/typings";
import React from "react";
import { LuFiles } from "react-icons/lu";
import { FaCheckCircle } from "react-icons/fa";

export function PickFile({ setFile, file }: any) {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Dialog onOpenChange={(isOpen) => setIsOpen(isOpen)} open={isOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant={"outline"} size={"icon"}>
          {file ? <FaCheckCircle size={15} /> : <LuFiles size={15} />}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Available files</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {useAppStore
            .getState()
            .globalFiles.map((card: FileType, index: number) => {
              return (
                <Button
                  key={card.id}
                  variant={card.filename === file ? "secondary" : "ghost"}
                  className="justify-start"
                  onClick={() => {
                    setFile(card.filename)
                    setIsOpen(false)
                  }}
                >
                  {index + 1}. {card.filename}
                </Button>
              );
            })}
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
