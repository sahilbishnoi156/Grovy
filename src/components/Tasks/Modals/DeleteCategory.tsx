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
import { useUser } from "@clerk/nextjs";
import { deleteDoc, doc } from "firebase/firestore";
import React from "react";
import { toast } from "sonner";

export function DeleteCategoryModal() {
  const { user } = useUser();
  const [currentCategoryId, isDeleteCategoryOpen, setIsDeleteCategoryOpen] =
  useTaskStore((state) => [
    state.currentCategoryId,
    state.isDeleteCategoryOpen,
    state.setIsDeleteCategoryOpen,
  ]);

  const deleteCategory = async () => {
    const promise = async () => {
      if (!user || !currentCategoryId) return;
      try {
        await deleteDoc(doc(db, "users", user.id, "categories", currentCategoryId));
      } catch (error) {
        console.log(error);
      } finally {
        setIsDeleteCategoryOpen(false)
      }
    };

    toast.promise(promise, {
      loading: "Deleting...",
      success: (data) => {
        return `Category has been Deleted.`;
      },
      error: "Something went wrong",
    });
  };

  return (
    <Dialog
      open={isDeleteCategoryOpen}
      onOpenChange={(isOpen) => {
        setIsDeleteCategoryOpen(isOpen)
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            file.!
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsDeleteCategoryOpen(false)}
          >
            <span className="sr-only">Close</span>
            <span>Close</span>
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={() => deleteCategory()}
          >
            <span className="sr-only">Delete</span>
            <span>Delete</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
