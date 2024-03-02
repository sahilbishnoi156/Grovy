"use client";

import * as React from "react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, TrashIcon } from "lucide-react";
import { IoEllipsisVertical } from "react-icons/io5";

type Checked = DropdownMenuCheckboxItemProps["checked"];

export function TaskDropDown({ openDeleteModal, openRenameModal }: any) {
  const [isOpen, setIsOpen] = React.useState(false)
  return (
    <DropdownMenu open={isOpen} onOpenChange={(isOpen)=>{
      setIsOpen(isOpen)
    }}>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer">
          <IoEllipsisVertical  className="text-neutral-400 hover:text-white" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <Button
          variant={"ghost"}
          onClick={() => {
            setIsOpen(false)
            openDeleteModal();
          }}
          className="flex items-center justify-start gap-2 w-full hover:text-red-500"
        >
          <TrashIcon size={15} />
          <span>Delete</span>
        </Button>
        <Button
          variant={"ghost"}
          onClick={() => {
            setIsOpen(false)
            openRenameModal();
          }}
          className="flex items-center justify-start gap-2 w-full"
        >
          <Pencil size={15}/>
          <span>Edit</span>
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
