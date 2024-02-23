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
import { Button } from "./ui/button";

export function SortFilter({
  filterFiles,
  allFilters,
  currentFilter,
}: {
  filterFiles: Function;
  allFilters: string[];
  currentFilter: string;
}) {
  return (
    <Select onValueChange={(e) => filterFiles(e)}>
      <SelectTrigger className="w-[150px]">
        <SelectValue
          placeholder={`${currentFilter ? currentFilter : "Filters"}`}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Choose</SelectLabel>
          {allFilters.map((filter) => {
            return (
              <SelectItem value={filter} key={filter}>
                {filter}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
