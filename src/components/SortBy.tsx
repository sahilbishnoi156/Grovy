"use client";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SORT_BY } from "@/constants";
import { useAppStore } from "@/store/store";

export function SortBy({
  sortFiles,
}: {
  sortFiles: Function;
}) {
  const sort = useAppStore.getState().currentSort;
  return (
    <Select onValueChange={(e) => sortFiles(e)}>
      <SelectTrigger className="w-[150px]">
        <SelectValue
          placeholder={`${
            sort === ""
              ? "Sort by: "
              : sort === "desc"
              ? "Newset"
              : sort === "asc"
              ? "Oldest"
              : "Name"
          }`}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Choose</SelectLabel>
          {(SORT_BY as []).map((filter: any) => {
            return (
              <SelectItem value={filter.value} key={filter.value}>
                {filter.name}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
