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
import { useTaskStore } from "@/store/TaskStore";
import { CATEGORY_COLOR } from "@/constants";

export function RenameCategoryModal() {
  const { user } = useUser();
  const [
    setIsRenameCategoryOpen,
    isRenameCategoryOpen,
    currentCategoryId,
    categoryName,
    categoryColor,
  ] = useTaskStore((state) => [
    state.setIsRenameCategoryOpen,
    state.isRenameCategoryOpen,
    state.currentCategoryId,
    state.categoryName,
    state.categoryColor,
  ]);
  const [input, setInput] = React.useState(categoryName);
  const [headingColor, setHeadingColor] = React.useState(categoryColor);

  React.useEffect(() => {
    setHeadingColor(categoryColor)
    setInput(input)
  }, [categoryColor,input])
  
  const renameFile = async () => {
    const promise = async () => {
      if (!user || !currentCategoryId) return;
      try {
        await updateDoc(
          doc(db, "users", user.id, "categories", currentCategoryId),
          {
            title: input,
            headingColor: headingColor || 'text-white',
          }
        );
      } catch (error) {
        console.log(error);
      } finally {
        setInput('')
        setHeadingColor('')
        setIsRenameCategoryOpen(false);
      }
    };
    toast.promise(promise, {
      loading: "Updating...",
      success: (data) => {
        return `Category has been Renamed.`;
      },
      error: "Error",
    });
  };

  return (
    <Dialog
      open={isRenameCategoryOpen}
      onOpenChange={(isOpen) => {
        setIsRenameCategoryOpen(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rename the File</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently rename your
            Category.!
          </DialogDescription>
        </DialogHeader>
        <div className="grid flex-1 gap-2">
          <Label htmlFor="categoryname" className="sr-only">
            Category Name
          </Label>
          <Input
            id="categoryname"
            defaultValue={categoryName}
            onChange={(e) => setInput(e.target.value)}
            onKeyDownCapture={(e) => {
              if (e.key === "Enter") {
                renameFile();
              }
            }}
          />
          <div className="flex flex-1 mt-3 gap-1">
            {CATEGORY_COLOR.map((color) => {
              return (
                <div
                  key={color?.text}
                  className={`${
                    color?.backgroundColor
                  } h-8 w-8 rounded-full border-2 duration-100  ${
                    headingColor === color?.text ? "dark:border-white border-neutral-800 scale-110" : ""
                  } cursor-pointer`}
                  onClick={() => setHeadingColor(color?.text!)}
                ></div>
              );
            })}
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsRenameCategoryOpen(false)}
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
