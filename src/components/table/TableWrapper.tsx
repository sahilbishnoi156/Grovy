"use client";
import React, { useCallback } from "react";
import { FileType } from "@/typings";
import { Button } from "../ui/button";
import { DataTable } from "./Table";
import { columns } from "./columns";
import { useUser } from "@clerk/nextjs";
import { collection, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { Skeleton } from "../ui/skeleton";
import { SortFilter } from "../SortFilter";
import { SortBy } from "../SortBy";
import { RotateCw } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function TableWrapper({ skeletons }: { skeletons: FileType[] }) {
  const { user } = useUser();
  const [allMainFiles, setAllMainFiles] = React.useState<FileType[]>([]);
  const [initialFiles, setInitialFiles] = React.useState<FileType[]>([]);
  const [allFilters, setAllFilters] = React.useState<string[]>([]);
  const [currentFilter, setCurrentFilter] = React.useState<string>("");
  const [sort, setSort] = React.useState<"asc" | "desc" | "filename">("desc");
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const reloadRef = React.useRef(null);

  const [docs, loading, error] = useCollection(
    user &&
      query(
        collection(db, "users", user.id, "files"),
        orderBy("timestamp", "desc")
      )
  );

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
    // Generating Filters
    const filteredArrays1 = Array.from(
      new Set(files.map((file) => file.type.split("/")[0]))
    );
    // Handle files with an empty string type by adding them to the "others" filter
    const filteredArrays2 = [
      "all",
      ...filteredArrays1.filter((type) => type !== ""),
    ];
    // Put the "others" filter at the end
    if (!filteredArrays2.includes("other")) {
      filteredArrays2.push("other");
    }
    setAllFilters(filteredArrays2);
    setInitialFiles(files);
    setAllMainFiles(files);
  }, [docs]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const sortFiles = (e: string, filteredFiles: FileType[] = initialFiles) => {
    router.replace(pathname + "?" + createQueryString("sortby", e), {
      scroll: false,
    });

    if (e === "asc" || e === "desc" || e === "filename") {
      let sortedFiles: FileType[] = [...filteredFiles];

      if (e === "asc") {
        sortedFiles = [...filteredFiles].sort(
          (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
        );
      } else if (e === "desc") {
        sortedFiles = [...filteredFiles].sort(
          (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
        );
      } else if (e === "filename") {
        sortedFiles = [...filteredFiles].sort((a, b) =>
          a.filename.localeCompare(b.filename)
        );
      }

      setInitialFiles(sortedFiles);
      setSort(e);
      return sortFiles;
    }
  };

  const filterFiles = (currentFilter: string) => {
    if (currentFilter === "all") {
      if (docs) {
        const files = docs.docs.map((doc) => ({
          id: doc.id,
          filename: doc.data().filename || doc.id,
          fullName: doc.data().fullName || doc.id,
          timestamp:
            new Date(doc.data().timestamp?.seconds * 1000) || undefined,
          downloadUrl: doc.data().downloadUrl,
          type: doc.data().type,
          size: doc.data().size,
        }));
        router.replace(
          pathname + "?" + createQueryString("filter", currentFilter),
          {
            scroll: false,
          }
        );
        setInitialFiles(files);
      }
    } else {
      const filteredFiles = allMainFiles.filter((file) => {
        if (currentFilter === "other") {
          return file.type.split("/")[0] === "";
        }
        return file.type.split("/")[0] === currentFilter;
      });

      setInitialFiles(filteredFiles);
      return filteredFiles;
    }
  };

  // Read query parameters on component mount
  React.useEffect(() => {
    const currentFilter = searchParams.get("filter");
    const currentSort = searchParams.get("sortby");
    if (currentFilter) {
      const filteredFiles = filterFiles(currentFilter);
      setCurrentFilter(currentFilter as string);
      if (
        currentSort === "asc" ||
        currentSort === "desc" ||
        currentSort === "filename"
      ) {
        setSort(currentSort);
        sortFiles(currentSort, filteredFiles);
      }
    }
  }, [allMainFiles]);

  if (docs?.docs.length === undefined) {
    return (
      <div className="flex flex-col space-y-5 pb-10">
        <div className="flex items-center justify-between">
          <div className="flex gap-4 items-center">
            <h2 className="font-bold ml-2 ">All Files </h2>
            <Button variant={"ghost"}>
              <RotateCw size={20} />
            </Button>
          </div>
          <div className="flex gap-4 items-center ">
            <Button variant={"outline"} className="w-36 h-12 mb-5"></Button>
            <Button variant={"outline"} className="w-36 h-12 mb-5"></Button>
          </div>
        </div>

        <div className="border rounded-lg">
          <div className="border-b h-12"></div>
          {skeletons.map((file: FileType) => {
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

  const refreshData = () => {
    const promise = () =>
      new Promise((resolve) =>
        setTimeout(() => resolve({ name: "Sonner" }), 5000)
      );
    toast.promise(promise, {
      loading: "Refreshing...",
      success: () => {
        return `Files updated`;
      },
      error: "Error",
    });
    if (reloadRef.current) {
      reloadRef.current.click();
    }
  };

  return (
    <div className="flex flex-col space-y-5 pb-10">
      <a href={pathname} ref={reloadRef}></a>
      <div className="flex items-center justify-between">
        <div className="flex gap-4 items-center justify-end">
          <h2 className="font-bold ml-2 ">All Files </h2>
          <Button variant={"ghost"} onClick={refreshData}>
            <RotateCw
              className="cursor-pointer hover:rotate-90 duration-200"
              size={20}
            />
          </Button>
        </div>
        <div className="flex gap-4 items-center justify-end">
          <SortFilter
            filterFiles={filterFiles}
            allFilters={allFilters}
            currentFilter={currentFilter}
          />
          <SortBy sortFiles={sortFiles} sort={sort} />
        </div>
      </div>

      <DataTable columns={columns} data={initialFiles} />
    </div>
  );
}
