"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { db } from "@/firebase";
import { useAppStore } from "@/store/store";
import { useUser } from "@clerk/nextjs";
import { doc, updateDoc } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { toast } from "sonner";

export function RenameModal() {
  const { user } = useUser();
  const [setIsRenameModalOpen, isRenameModalOpen, fileId, filename] =
    useAppStore((state) => [
      state.setIsRenameModalOpen,
      state.isRenameModalOpen,
      state.fileId,
      state.filename,
    ]);
  const [input, setInput] = React.useState(filename);

  const renameFile = async () => {
    const promise = async () => {
      if (!user || !fileId) return;
      try {
        await updateDoc(doc(db, "users", user.id, "files", fileId), {
          filename: input,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setInput("");
        setIsRenameModalOpen(false);
      }
    };
    toast.promise(promise, {
      loading: "Updating...",
      success: (data) => {
        return `File has been Renamed.`;
      },
      error: "Error",
    });
  };

  return (
    <Dialog
      open={isRenameModalOpen}
      onOpenChange={(isOpen) => {
        setIsRenameModalOpen(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rename the File</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently rename your
            file.!
          </DialogDescription>
        </DialogHeader>
        <div className="grid flex-1 gap-2">
          <Label htmlFor="filename" className="sr-only">
            FileName
          </Label>
          <Input
            id="filename"
            defaultValue={filename}
            onChange={(e) => setInput(e.target.value)}
            onKeyDownCapture={(e) => {
              if (e.key === "Enter") {
                renameFile();
              }
            }}
          />
        </div>
        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsRenameModalOpen(false)}
          >
            <span className="sr-only">Close</span>
            <span>Close</span>
          </Button>
          <Button type="button" variant="sucess" onClick={() => renameFile()}>
            <span className="sr-only">Save</span>
            <span>Save</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
