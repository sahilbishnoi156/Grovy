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
import { CheckCheck, Trash } from "lucide-react";
import { pickBy, identity } from "lodash";
import { Toggle } from "@/components/ui/toggle";

export function CardOptionsModal() {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const { user } = useUser();

  //* Local state
  const [isUpdating, setIsUpdating] = React.useState(false);

  //* Global State
  const [isCardOptionsOpen, setIsCardOptionsOpen, card] = useTaskStore(
    (state) => [state.isCardOptionsOpen, state.setIsCardOptionsOpen, state.card]
  );

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
            start: card.timeBound?.start,
            end: card.timeBound?.isCompleted ? null  : card.timeBound?.end,
            isCompleted: card.timeBound?.isCompleted
          },
        });
      } catch (error) {
        console.log(error);
      } finally {
        setIsUpdating(false);
        setIsCardOptionsOpen(false);
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
        onOpenChange={(isOpen) => setIsCardOptionsOpen(isOpen)}
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
                onClick={() => setIsCardOptionsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant={"sucess"}
                disabled={isUpdating}
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
      onOpenChange={(isOpen) => setIsCardOptionsOpen(isOpen)}
    >
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when you are done.
          </DrawerDescription>
        </DrawerHeader>
        <ProfileForm
          className="px-4"
          card={card}
          isUpdating={isUpdating}
          handleSaveDocument={handleSaveDocument}
        />
        <DialogFooter className="p-4">
          <Button
            type="button"
            variant={"ghost"}
            disabled={isUpdating}
            className="hover:text-red-600 gap-2"
            onClick={handleDeleteCard}
          >
            Remove
          </Button>
          <Button
            type="button"
            disabled={isUpdating}
            variant={"ghost"}
            onClick={() => setIsCardOptionsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant={"sucess"}
            disabled={isUpdating}
            onClick={handleSaveDocument}
          >
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
        <Input
          type="text"
          id="description"
          defaultValue={card.description}
          onChange={(e) =>
            useTaskStore.setState({
              card: {
                ...card,
                description: e.target.value,
              },
            })
          }
        />
      </div>
      <div className="flex gap-4">
        <AddLink
          link={card.link}
          setLink={(value: string) => {
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
        {card.timeBound?.end && (card.timeBound.end.getTime() > new Date().getTime()) && (
          <Button
            variant={card.timeBound?.isCompleted ? "default" : "outline"}
            size={"icon"}
            type="button"
            onClick={(v) =>{
              useTaskStore.setState({
                card: {
                  ...card,
                  timeBound: {
                    isCompleted: !card.timeBound?.isCompleted,
                    start: card.timeBound?.start,
                    end: card.timeBound?.end
                  },
                },
              })
            }}
          >
            <CheckCheck />
          </Button>
        )}
      </div>
    </div>
  );
}
