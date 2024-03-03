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
import { useTaskStore } from "@/store/TaskStore";
import { CardType } from "@/typings";
import { useUser } from "@clerk/nextjs";
import { deleteDoc, doc } from "firebase/firestore";
import React from "react";
import { toast } from "sonner";

export function DeleteCardModal() {
  const { user } = useUser();

  //* Global State
  const [isDeleteCardOpen, setIsDeleteCardOpen, cardId] = useTaskStore(
    (state) => [state.isDeleteCardOpen, state.setIsDeleteCardOpen, state.cardId]
  );

  //* Local State
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDeleteCard = async () => {
    setIsDeleting(true)
    const promise = async () => {
      if (!user || !cardId) return;
      try {
        await deleteDoc(doc(db, "users", user.id, "cards", cardId));
      } catch (error) {
        console.log(error);
      } finally {
        setIsDeleting(false)
        setIsDeleteCardOpen(false);
      }
    };

    toast.promise(promise, {
      loading: "Deleting task...",
      success: (data) => {
        return `Task deleted successfully`;
      },
      error: "Error",
    });
  };

  return (
    <Dialog
      open={isDeleteCardOpen}
      onOpenChange={(isOpen) => {
        setIsDeleteCardOpen(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-400">Ohoooooo!</DialogTitle>
          <DialogDescription>
            Are you really deleting this task? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsDeleteCardOpen(false)}
          >
            <span className="sr-only">Close</span>
            <span>Close</span>
          </Button>
          <Button type="button" variant="danger" onClick={handleDeleteCard} disabled={isDeleting}>
            <span className="sr-only">Delete</span>
            <span>Delete</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
