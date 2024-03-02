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
import { useTaskStore } from "@/store/TaskStore";
import { CardType } from "@/typings";
import React from "react";
import { toast } from "sonner";

export function DeleteCardModal({ setCards }: any) {
  const [isDeleteCardOpen, setIsDeleteCardOpen, cardId] = useTaskStore(
    (state) => [state.isDeleteCardOpen, state.setIsDeleteCardOpen, state.cardId]
  );

  const handleDeleteCard = () => {
    if (!cardId) return;
    setCards((pv: CardType[]) =>
      pv.filter((c) => c.id.toString() !== cardId.toString())
    );
    toast.success("Task deleted successfully")
    setIsDeleteCardOpen(false);
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
          <DialogTitle>Are you sure you want to delete?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            card!
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
          <Button type="button" variant="danger" onClick={handleDeleteCard}>
            <span className="sr-only">Delete</span>
            <span>Delete</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
