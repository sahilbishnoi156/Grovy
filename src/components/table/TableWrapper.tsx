"use client";
import React from "react";
import { FileType } from "@/typings";
import { Button } from "../ui/button";
import { DataTable } from "./Table";
import { columns } from "./columns";
import { useUser } from "@clerk/nextjs";
import { collection, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { Skeleton } from "../ui/skeleton";
import { FiltersDropDown } from "../FiltersDropDown";
import { SortBy } from "../SortBy";
import { useAppStore } from "@/store/store";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import _ from "lodash";

export default function TableWrapper({ skeletons }: { skeletons: FileType[] }) {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  //* Global states
  const [
    globalFiles,
    setGlobalFiles,
    setGeneratedFiltersByFiles,
    setCurrentFilter,
    setCurrentSort,
  ] = useAppStore((state) => [
    state.globalFiles,
    state.setGlobalFiles,
    state.setGeneratedFiltersByFiles,
    state.setCurrentFilter,
    state.setCurrentSort,
  ]);

  //* Local States
  const [tempFiles, setTempFiles] = React.useState<FileType[]>([]);

  //* Firebase collection
  const [docs, loading, error] = useCollection(
    user &&
      query(
        collection(db, "users", user.id, "files"),
        orderBy("timestamp", "desc")
      )
  );

  //* Search function
  function debouncedSearch(term: string) {
    if (term) {
      const searchedFiles = globalFiles.filter(
        (file) =>
          file.filename.toLowerCase().includes(term.toLowerCase()) ||
          file.timestamp.toLocaleDateString().includes(term.toLowerCase())
      );
      setTempFiles(searchedFiles);
    } else {
      setTempFiles(globalFiles);
    }
  }
  const handleSearchFile = _.debounce(debouncedSearch, 400);

  React.useEffect(() => {
    function debouncedSearch(term: string) {
      if (term) {
        const searchedFiles = globalFiles.filter(
          (file) =>
            file.filename.toLowerCase().includes(term.toLowerCase()) ||
            file.timestamp.toLocaleDateString().includes(term.toLowerCase())
        );
        setTempFiles(searchedFiles);
      } else {
        setTempFiles(globalFiles);
      }
    }
    debouncedSearch(searchParams.get("query") as string);
  }, [globalFiles, searchParams]);

  React.useEffect(() => {
    if (!docs) return;
    const files = docs.docs.map((doc) => ({
      id: doc.id,
      filename: doc.data().filename || doc.id,
      fullName: doc.data().fullName || doc.id,
      timestamp: new Date(doc.data().timestamp?.seconds * 1000) || undefined,
      downloadUrl: doc.data().downloadUrl,
      type: doc.data().type,
      size: doc.data().size,
    }));
    setTempFiles(files);
    setGlobalFiles(files);
    setCurrentFilter("all");
    setCurrentSort("desc");
  }, [docs, setCurrentFilter, setCurrentSort, setGlobalFiles]);

  // Generate filters based on unique file types
  React.useEffect(() => {
    if (!globalFiles) return;
    const uniqueTypes = Array.from(
      new Set(globalFiles.map((file) => file.type.split("/")[0]))
    );
    const filterNamesWithoutEmptyValues = [
      "all",
      ...uniqueTypes.filter((type) => type !== ""),
    ];
    if (
      !filterNamesWithoutEmptyValues.includes("other") &&
      uniqueTypes.find((type) => type === "")
    ) {
      filterNamesWithoutEmptyValues.push("other");
    }
    setGeneratedFiltersByFiles(filterNamesWithoutEmptyValues);
  }, [globalFiles, setGeneratedFiltersByFiles]);

  // Sort files based on selected sort option
  const sortFiles = (sortOption: "asc" | "desc" | "filename") => {
    setCurrentSort(sortOption);
    const sortedFiles = [...tempFiles]; // Copy to avoid mutation
    if (sortOption === "asc") {
      sortedFiles.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    } else if (sortOption === "desc") {
      sortedFiles.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    } else if (sortOption === "filename") {
      sortedFiles.sort((a, b) => a.filename.localeCompare(b.filename));
    }
    setTempFiles(sortedFiles);
  };

  // Filter files based on selected filter
  const filterFiles = (filter: string) => {
    setCurrentFilter(filter);
    if (filter === "all") {
      setTempFiles(globalFiles);
    } else {
      const filteredFiles = globalFiles.filter((file) => {
        if (filter === "other") {
          return file.type.split("/")[0] === "";
        }
        return file.type.split("/")[0] === filter;
      });
      setTempFiles(filteredFiles);
    }
  };

  if (docs?.docs.length === undefined) {
    return (
      <div className="flex flex-col space-y-5 pb-10">
        <div className="flex gap-4 items-center">
          <h2 className="font-bold ml-2 ">My Files</h2>
        </div>
        <div className="flex items-center justify-between mb-5">
          <div className="relative dark:text-white text-black bg-transparent w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
              <Search size={18} />
            </span>
            <input
              type="search"
              name="searchQuery"
              className="py-[0.55rem] text-sm rounded-md pl-8 pr-2 focus:outline-none bg-transparent border-[1px] focus:border-white md:w-96 w-full"
              disabled
              placeholder="Filename"
              autoComplete="off"
            />
          </div>
          <div className="flex gap-4 items-center ">
            <Button variant={"outline"} className="w-36 h-10 "></Button>
            <Button variant={"outline"} className="w-36 h-10 "></Button>
          </div>
        </div>

        <div className="border rounded-lg">
          <div className="border-b h-12"></div>
          {skeletons.slice(0, 3).map((file: FileType) => {
            return (
              <div
                key={file.id}
                className="flex items-center space-x-4 p-5 w-full"
              >
                <Skeleton className="h-12 w-12" />
                <Skeleton className="h-12 w-full" />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-5 pb-10">
      <div className="flex gap-4 items-center">
        <h2 className="font-bold ml-2 ">My Files</h2>
      </div>
      <div className="flex items-start justify-between sm:flex-row flex-col lg:items-center gap-2">
        <div className="relative dark:text-white text-black bg-transparent w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-2">
            <Search size={18} />
          </span>
          <input
            type="search"
            name="searchQuery"
            className="py-[0.55rem] text-sm rounded-md pl-8 pr-2 focus:outline-none bg-transparent border-[1px] focus:border-white md:w-96 w-full"
            placeholder="Filename"
            onKeyDown={(e: any) => {
              if (e.key === "Enter") {
                handleSearchFile(e.target.value);
              }
            }}
            defaultValue={searchParams.get("query") as string}
            onChange={(e) => {
              const params = new URLSearchParams(searchParams);
              if (e.target.value) {
                params.set("query", e.target.value);
                replace(`${pathname}?${params.toString()}`);
              } else {
                params.delete("query");
                replace(`${pathname}?${params.toString()}`);
              }
              handleSearchFile(e.target.value);
            }}
            autoComplete="off"
          />
        </div>
        <div className="flex gap-1 items-center justify-start md:justify-end flex-wrap w-full">
          <FiltersDropDown filterFiles={filterFiles} />
          <SortBy sortFiles={sortFiles} />
        </div>
      </div>

      <DataTable columns={columns} data={tempFiles} />
    </div>
  );
}
