/* eslint-disable @next/next/no-img-element */
"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { FileType } from "@/typings";
import { PencilIcon, TrashIcon } from "lucide-react";
import { useAppStore } from "@/store/store";
import { DeleteModal } from "../Modals/DeleteModal";
import { RenameModal } from "../Modals/RenameModal";
import { ToolTip } from "../Modals/ToolTip";
import Image from "next/image";
import ShowVideo from "../ShowVideo";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  function isShowableImage(type: string) {
    return type.split("/")[0] === "image";
  }
  function isShowableVideo(type: string) {
    return type.split("/")[0] === "video";
  }

  const [setFilename, setFileId, setIsDeletingModalOpen, setIsRenameModalOpen] =
    useAppStore((state) => [
      state.setFilename,
      state.setFileId,
      state.setIsDeletingModalOpen,
      state.setIsRenameModalOpen,
    ]);
  const openDeleteModal = (fileId: string) => {
    setFileId(fileId);
    setIsDeletingModalOpen(true);
  };

  const openRenameModal = (fileId: string, filename: string) => {
    setFileId(fileId);
    setFilename(filename);
    setIsRenameModalOpen(true);
  };
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                <DeleteModal />
                <RenameModal />
                {row.getVisibleCells().map((cell) => {
                  return (
                    <TableCell key={cell.id}>
                      {cell.column.id === "timestamp" ? (
                        <div className="flex flex-col">
                          <div className="text-sm">
                            {(cell.getValue() as Date).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-neutral-400">
                            {(cell.getValue() as Date).toLocaleTimeString()}
                          </div>
                        </div>
                      ) : cell.column.id === "filename" ? (
                        <ToolTip content="rename file">
                          <p
                            onClick={() => {
                              openRenameModal(
                                (row.original as FileType).id,
                                (row.original as FileType).filename
                              );
                            }}
                            className="hover:underline inline-flex items-center hover:cursor-pointer gap-3 group hover:text-neutral-400"
                          >
                            {cell.getValue() as string}
                            <PencilIcon
                              size={15}
                              className="opacity-0 group-hover:opacity-100"
                            />
                          </p>
                        </ToolTip>
                      ) : cell.column.id === "type" ? (
                        <a
                          href={
                            (row?.getVisibleCells()[4]?.getValue() as string) ||
                            ""
                          }
                          target="_blank"
                          className="group"
                        >
                          {isShowableImage(
                            row?.getVisibleCells()[0]?.getValue() as string
                          ) ? (
                            <div className="relative h-12 w-10 rounded-lg ">
                              <Image
                                src={
                                  row
                                    ?.getVisibleCells()[4]
                                    ?.getValue() as string
                                }
                                alt={
                                  (row
                                    ?.getVisibleCells()[1]
                                    ?.getValue() as string) || "not found"
                                }
                                fill
                                sizes={`sizes="(max-width: 768px) 48px, (max-width: 1200px) 48px, 48px"`}
                                className="rounded-lg object-cover"
                              />
                            </div>
                          ) : isShowableVideo(
                              row?.getVisibleCells()[0]?.getValue() as string
                            ) ? (
                            <ShowVideo
                              row={row}
                              videoPlaceHolder={flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            />
                          ) : (
                            flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )
                          )}
                        </a>
                      ) : (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      )}
                    </TableCell>
                  );
                })}

                <TableCell key={(row.original as FileType).id}>
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
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                You have No Files.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
