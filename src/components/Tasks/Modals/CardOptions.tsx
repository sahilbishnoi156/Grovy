"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/firebase";
import { useTaskStore } from "@/store/TaskStore";
import { useUser } from "@clerk/nextjs";
import {
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@uidotdev/usehooks";
import { CardProps, CardType } from "@/typings";
import { DatePicker } from "../Columns/Card/CardOptions/DatePicker";
import { PickFile } from "../Columns/Card/CardOptions/PickFiles";
import { AddLink } from "../Columns/Card/CardOptions/AddLink";
import { usePathname } from "next/navigation";
import { CheckCheck, Save, Trash, Trash2, X } from "lucide-react";
import { pickBy, identity } from "lodash";
import { Toggle } from "@/components/ui/toggle";

export function CardOptionsModal() {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const { user } = useUser();

  //* Local state
  const [isUpdating, setIsUpdating] = React.useState(false);

  //* Global State
  const [isCardOptionsOpen, setIsCardOptionsOpen, card, isEditable] =
    useTaskStore((state) => [
      state.isCardOptionsOpen,
      state.setIsCardOptionsOpen,
      state.card,
      state.isEditable,
    ]);

  const handleDeleteCard = async () => {
    setIsUpdating(true);
    const promise = async () => {
      if (!user || !card?.id) return;
      try {
        await deleteDoc(doc(db, "users", user.id, "cards", card.id));
      } catch (error) {
        console.log(error);
      } finally {
        setIsUpdating(false);
        setIsCardOptionsOpen(false);
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

  //* Save Document
  const handleSaveDocument = async () => {
    setIsUpdating(true);
    const promise = async () => {
      if (!card) return;
      if (!user || !card.id) return;
      const newCard = pickBy(card, identity);
      try {
        await setDoc(doc(db, "users", user.id, "cards", card.id), {
          ...newCard,
          timeBound: {
            start: card.timeBound?.start || null,
            end: card.timeBound?.isCompleted
              ? null
              : card.timeBound?.end || null,
            isCompleted: card.timeBound?.isCompleted || false,
          },
        });
      } catch (error) {
        console.log(error);
      } finally {
        setIsUpdating(false);
        setIsCardOptionsOpen(false);
        useTaskStore.setState({isEditable: false})
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

  if (!isSmallDevice) {
    return (
      <Dialog
        open={isCardOptionsOpen}
        onOpenChange={(isOpen) => {
          console.log('object');
          useTaskStore.setState({ isEditable: false });
          setIsCardOptionsOpen(isOpen);
        }}
      >
        <DialogContent
          className="sm:max-w-[425px]"
          onDoubleClick={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Make changes to your Task here. Click save when you are done.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm
            card={card}
            isUpdating={isUpdating}
            handleSaveDocument={handleSaveDocument}
          />
          <DialogFooter className="">
            <Button
              type="button"
              variant={"ghost"}
              disabled={isUpdating}
              className="hover:text-red-600 gap-2"
              onClick={handleDeleteCard}
            >
              <Trash size={20} /> Remove
            </Button>
            <div className="w-full flex items-center justify-end gap-4">
              <Button
                type="button"
                disabled={isUpdating}
                variant={"ghost"}
                onClick={() => {
                  useTaskStore.setState({isEditable: false})
                  setIsCardOptionsOpen(false)
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant={"sucess"}
                disabled={isUpdating || !isEditable}
                onClick={handleSaveDocument}
              >
                Save
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      open={isCardOptionsOpen}
      onOpenChange={(isOpen) => {
        useTaskStore.setState({ isEditable: false });
        setIsCardOptionsOpen(isOpen);
      }}
    >
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit Task</DrawerTitle>
          <DrawerDescription>
            Make changes to your task here. Click save when you are done.
          </DrawerDescription>
        </DrawerHeader>
        <ProfileForm
          className="px-4"
          card={card}
          isUpdating={isUpdating}
          handleSaveDocument={handleSaveDocument}
        />
        <DialogFooter className="p-4 gap-3">
          <Button
            type="button"
            variant={"outline"}
            disabled={isUpdating}
            className="hover:text-red-600 gap-2"
            onClick={handleDeleteCard}
          >
            <Trash2 />
            Remove
          </Button>
          <Button
            type="button"
            disabled={isUpdating}
            variant={"outline"}
            className="gap-2"
            onClick={() => setIsCardOptionsOpen(false)}
          >
            <X />
            Close
          </Button>
          <Button
            type="button"
            variant={"sucess"}
            disabled={isUpdating || !isEditable}
            className="gap-2"
            onClick={handleSaveDocument}
          >
            <Save />
            Save
          </Button>
        </DialogFooter>
      </DrawerContent>
    </Drawer>
  );
}

function ProfileForm({ className, card }: any) {
  return (
    <div className={cn("grid items-start gap-4", className)}>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          autoFocus
          defaultValue={card.description}
          placeholder="Add new task..."
          className="w-full rounded border border-orange-400 bg-orange-400/20 p-3 text-sm text-neutral-800 dark:text-neutral-50 placeholder-orange-300 focus:outline-0 outline-none white"
          onChange={(e) => {
            useTaskStore.setState({ isEditable: true });
            useTaskStore.setState({
              card: {
                ...card,
                description: e.target.value,
              },
            });
          }}
        />
      </div>
      <div className="flex gap-4">
        <AddLink
          link={card.link}
          setLink={(value: string) => {
            useTaskStore.setState({ isEditable: true });
            useTaskStore.setState({
              card: {
                ...card,
                link: value,
              },
            });
          }}
        />
        <PickFile
          file={card.file}
          setFile={(value: string) => {
            useTaskStore.setState({ isEditable: true });
            if (
              card.file &&
              value === new URL(card.file).searchParams.get("query")
            ) {
              useTaskStore.setState({
                card: {
                  ...card,
                  file: undefined,
                },
              });
            } else {
              useTaskStore.setState({
                card: {
                  ...card,
                  file: `https://grovy.vercel.app/files?query=${value.trim()}`,
                },
              });
            }
          }}
        />
        <DatePicker
          value={{ date: card?.timeBound?.end || undefined }}
          onChange={(value) => {
            useTaskStore.setState({ isEditable: true });
            useTaskStore.setState({
              card: {
                ...card,
                timeBound: value
                  ? {
                      isCompleted: false,
                      start: serverTimestamp(),
                      end: value.date,
                    }
                  : null,
              },
            });
          }}
        />
        {card.timeBound?.end &&
          card.timeBound.end.getTime() > new Date().getTime() && (
            <Button
              variant={card.timeBound?.isCompleted ? "default" : "outline"}
              size={"icon"}
              type="button"
              onClick={(v) => {
                useTaskStore.setState({ isEditable: true });
                useTaskStore.setState({
                  card: {
                    ...card,
                    timeBound: {
                      isCompleted: !card.timeBound?.isCompleted,
                      start: card.timeBound?.start,
                      end: card.timeBound?.end,
                    },
                  },
                });
              }}
            >
              <CheckCheck />
            </Button>
          )}
      </div>
    </div>
  );
}
