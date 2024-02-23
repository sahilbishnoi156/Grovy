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

export function SortBy({
  sortFiles,
  sort,
}: {
  sortFiles: Function;
  sort: string;
}) {
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
              : "Filename"
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
