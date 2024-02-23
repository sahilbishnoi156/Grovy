"use client";

import * as React from "react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, MoreHorizontal, TrashIcon } from "lucide-react";

type Checked = DropdownMenuCheckboxItemProps["checked"];

export function MoreOptions({ openDeleteModal }: any) {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Button
          variant={"ghost"}
          onClick={() => {
            openDeleteModal();
          }}
          className="flex items-center justify-start gap-2 w-full text-red-500"
        >
          <TrashIcon size={15} />
          <span>Delete</span>
        </Button>
        <Button
          variant={"ghost"}
          className="flex items-center justify-start gap-2 w-full"
        >
          <a href="">
            <Download size={15} />
            Download
          </a>
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
