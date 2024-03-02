"use client";
import { COLOR_EXTENSION_MAP } from "@/constants";
import { FileType } from "@/typings";
import { ColumnDef } from "@tanstack/react-table";
import prettyBytes from "pretty-bytes";
import { FileIcon, defaultStyles } from "react-file-icon";
import { ToolTip } from "@/components/Modals/ToolTip";
import { PencilIcon, TrashIcon } from "lucide-react";
import { useAppStore } from "@/store/store";
import Image from "next/image";
import ShowVideo from "../ShowVideo";
import { Button } from "../ui/button";

const openRenameModal = (fileId: string, filename: string) => {
  useAppStore.setState({fileId: fileId, filename: filename, isRenameModalOpen: true});
};
const openDeleteModal = (fileId: string) => {
  useAppStore.setState({fileId: fileId, isDeletingModalOpen: true});
};

function isShowableImage(type: string) {
  return type.split("/")[0] === "image";
}
function isShowableVideo(type: string) {
  return type.split("/")[0] === "video";
}

export const columns: ColumnDef<FileType>[] = [
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ renderValue, row, ...props }) => {
      const visibleCells = row?.getVisibleCells() || [];

      const link = (visibleCells[4]?.getValue() as string) || "";
      const type = (visibleCells[0]?.getValue() as string) || "";
      const isImage = isShowableImage(type);
      const isVideo = isShowableVideo(type);
  
      return (
        <ToolTip content="open file">
          <a href={link} target="_blank" className="group">
            {isImage ? (
              <div className="relative h-12 w-10 rounded-lg">
                <Image
                  src={link}
                  alt={(row?.getVisibleCells()[1]?.getValue() as string) || "not found"}
                  fill
                  sizes={`sizes="(max-width: 768px) 48px, (max-width: 1200px) 48px, 48px"`}
                  className="rounded-lg object-cover"
                />
              </div>
            ) : isVideo ? (
              <ShowVideo
                row={row}
                videoPlaceHolder={<div className="w-10">
                <FileIcon
                  extension={type.split("/")[1]}
                  labelColor={COLOR_EXTENSION_MAP['bmp']}
                  //@ts-ignore
                  {...defaultStyles[type.split("/")[1]]}
                />
              </div>}
              />
            ) : (
              <div className="w-10">
                <FileIcon
                  extension={type.split("/")[1]}
                  labelColor={COLOR_EXTENSION_MAP[type.split("/")[1]]}
                  //@ts-ignore
                  {...defaultStyles[type.split("/")[1]]}
                />
              </div>
            )}
          </a>
        </ToolTip>
      );  
    },
  },  
  {
    accessorKey: "filename",
    header: "Filename",
    cell: ({renderValue, row, ... props})=>{
      return <ToolTip content="rename file">
      <p
        onClick={() => {
          openRenameModal(
            (row.original as FileType).id,
            (row.original as FileType).filename
          );
        }}
        className="hover:underline inline-flex items-center hover:cursor-pointer gap-3 group hover:text-neutral-400"
      >
        {renderValue() as string}
        <PencilIcon
          size={15}
          className="opacity-0 group-hover:opacity-100"
        />
      </p>
    </ToolTip>
    }
  },
  {
    accessorKey: "timestamp",
    header: "Date Added",
    cell: ({ renderValue, ...props }) => {
      return <div className="flex flex-col">
      <div className="text-sm">
        {(renderValue() as Date).toLocaleDateString()}
      </div>
      <div className="text-xs text-neutral-400">
        {(renderValue() as Date).toLocaleTimeString()}
      </div>
    </div>
    },
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ renderValue, ...props }) => {
      return <span>{prettyBytes(renderValue() as number)}</span>;
    },
  },
  {
    accessorKey: "downloadUrl",
    header: "Options",
    cell: ({ renderValue, row, ...props }) => {
      return (
        <ToolTip content="delete file" isDanger={true}>
        <Button
          variant={"ghost"}
          onClick={() => {
            openDeleteModal((row.original as FileType).id);
          }}
        >
          <TrashIcon size={20} />
        </Button>
      </ToolTip>
      );
    },
  },
];
