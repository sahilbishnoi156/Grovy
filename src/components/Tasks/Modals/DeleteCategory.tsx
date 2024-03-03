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
import { collection, doc, getDocs, writeBatch } from "firebase/firestore";
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

  async function deleteCategoryWithCascadingUpdates(
    currentCategoryId: string
  ): Promise<void> {
    if(!user) return;
    // 1. Fetch the entire "cards" collection for the user:
    const cardsRef = collection(db, "users", user.id, "cards");
    const cardsSnapshot = await getDocs(cardsRef);
  
    // 2. Create a write batch to efficiently update multiple documents:
    const batch = writeBatch(db);
  
    // 3. Iterate through each card document:
    cardsSnapshot.forEach((cardDoc) => {
      const cardData = cardDoc.data() as CardType; 
      if (cardData.categoryId === currentCategoryId) {
        //If the card belongs to the deleted category Update the categoryId to uncategorized
        batch.update(cardDoc.ref, { categoryId: "uncategorized" });
      }
    });
  
    // 4. Delete the category document:
    batch.delete(doc(db, "users", user.id, "categories", currentCategoryId));
  
    // 5. Commit the batch write operation:
    await batch.commit();
  }

  const deleteCategory = async () => {
    const promise = async () => {
      if (!user || !currentCategoryId) return;
      try {
        await deleteCategoryWithCascadingUpdates(currentCategoryId);
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
