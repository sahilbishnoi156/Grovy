"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { FaPlus } from "react-icons/fa6";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CategorySchema } from "@/typings";
import z from "zod";
import { toast } from "sonner";
import Spinner from "./Spinner";
import { useTaskStore } from "@/store/TaskStore";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { CATEGORY_COLOR } from "@/constants";

type CategoryForm = z.infer<typeof CategorySchema>;


export function AddCategory() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryForm>({
    resolver: zodResolver(CategorySchema),
  });
  // component states
  const [headingColor, setHeadingColor] = React.useState("text-white");
  const [open, setOpen] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);
  const { isLoaded, isSignedIn, user } = useUser();
  // zustand state
  const categories = useTaskStore((state) => state.categories);

  // Form Submition
  const onFormSubmit = async (data: CategoryForm) => {
    if (!user) return;
    if (isCreating) return;
    setIsCreating(true);
    const newData = { ...data, headingColor: headingColor };
    if (categories.find((c) => c.title === newData.title)) {
      throw new Error("Category Already Exists");
    }
    const docRef = await addDoc(
      collection(db, "users", user.id, "categories"),
      {
        userId: user.id,
        title: newData.title,
        headingColor: newData.headingColor,
        fullName: user.fullName,
        profileImg: user.imageUrl,
        timestamp: serverTimestamp(),
      }
    );
    setIsCreating(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="mb-2">Total Categories {categories.length || 0}</div>
      <DialogTrigger asChild>
        <Button variant="secondary" className="flex items-center gap-2 group">
          Add Category <FaPlus className="group-hover:rotate-90 duration-300" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
          <DialogDescription>
            This category will be added to categories section.
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex items-center space-y-4 flex-col w-full"
          onSubmit={handleSubmit((data) => {
            const promise = async () => {
              await onFormSubmit(data);
            };
            toast.promise(promise, {
              loading: "Creating Category...",
              success: (data) => {
                setOpen(false);
                return `Category created.`;
              },
              error: (error) => {
                console.log(error);
                if (typeof error.message === "string") {
                  return error.message;
                } else {
                  return "something went wrong";
                }
              },
            });
          })}
        >
          <div className="grid flex-1 gap-2 w-full">
            <Label htmlFor="category" className="sr-only">
              Title
            </Label>
            <Input id="category" {...register("title")} placeholder="Title" />
            <span className="text-xs text-red-500">
              {errors.title?.message}
            </span>
          </div>
          <div className="flex flex-1 gap-2 w-full">
            <Input
              id="headingColor"
              {...register("headingColor")}
              placeholder="headingColor"
              className="hidden"
              value={"text-white"}
            />
            {CATEGORY_COLOR.map((color) => {
              return (
                <div
                  key={color?.text}
                  className={`${
                    color?.backgroundColor
                  } h-8 w-8 rounded-full border-2 duration-150  ${
                    headingColor === color?.text ? "dark:border-white border-neutral-800 scale-110" : ""
                  } cursor-pointer`}
                  onClick={() => setHeadingColor(color?.text!)}
                ></div>
              );
            })}
          </div>
          <DialogFooter className="sm:justify-start self-start w-full gap-2">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
            <Button type="submit" variant="default">
              {isSubmitting ? <Spinner /> : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
