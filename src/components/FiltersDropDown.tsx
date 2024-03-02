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
import { useAppStore } from "@/store/store";

export function FiltersDropDown({ filterFiles }: { filterFiles: Function }) {
  const currentFilter = useAppStore.getState().currentFilter;
  function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  return (
    <Select onValueChange={(e) => filterFiles(e)}>
      <SelectTrigger className="w-[150px]">
        <SelectValue
          placeholder={`${
            currentFilter ? capitalizeFirstLetter(currentFilter) : "Filters"
          }`}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Choose</SelectLabel>
          {(
            (useAppStore.getState().generatedFiltersByFiles as string[]) || []
          ).map((filter) => {
            return (
              <SelectItem value={filter} key={filter}>
                {capitalizeFirstLetter(filter)}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
