"use client";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { db } from "@/firebase";
import { useTaskStore } from "@/store/TaskStore";
import { CardType } from "@/typings";
import { useUser } from "@clerk/nextjs";
import { deleteDoc, doc } from "firebase/firestore";
import React from "react";
import { toast } from "sonner";

export function DeleteCardModal() {
   const { user } = useUser();

  //* Local state
  const [isDeleting, setIsDeleting] = React.useState(false)

  //* Global State
  const [isDeleteCardOpen, setIsDeleteCardOpen, cardId] = useTaskStore(
    (state) => [state.isDeleteCardOpen, state.setIsDeleteCardOpen, state.cardId]
  );

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
    <AlertDialog open={isDeleteCardOpen} onOpenChange={(isOpen)=>setIsDeleteCardOpen(isOpen)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-400">Ohooooo!</AlertDialogTitle>
          <AlertDialogDescription>
            Are you really deleting this card? This will permanently delete your
            card.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button type="button" variant="danger" onClick={handleDeleteCard} disabled={isDeleting}>
            <span className="sr-only">Delete</span>
            <span>Delete</span>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}