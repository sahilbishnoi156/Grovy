"use client";
import { COLOR_EXTENSION_MAP } from "@/constants";
import { FileType } from "@/typings";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import prettyBytes from "pretty-bytes";
import { FileIcon, defaultStyles } from "react-file-icon";
import { ToolTip } from "@/components/Modals/ToolTip";

export const columns: ColumnDef<FileType>[] = [
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ renderValue, ...props }) => {
      const type = renderValue() as string;
      const extension: string = type.split("/")[1];
      return (
        <ToolTip content="open file">
          <div className="w-10">
            <FileIcon
              extension={extension}
              labelColor={COLOR_EXTENSION_MAP[extension]}
              //@ts-ignore
              {...defaultStyles[extension]}
            />
          </div>
        </ToolTip>
      );
    },
  },
  {
    accessorKey: "filename",
    header: "Filename",
  },
  {
    accessorKey: "timestamp",
    header: "Date Added",
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
    header: "Link",
    cell: ({ renderValue, ...props }) => {
      return (
        <ToolTip content="download file">
          <a
            href={(renderValue() as string) || ""}
            target="_blank"
            download
            className="hover:underline hover:text-blue-500 text-blue-300"
          >
            Download
          </a>
        </ToolTip>
      );
    },
  },
];
