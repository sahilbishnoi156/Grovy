import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAppStore } from "@/store/store";
import { FileType } from "@/typings";
import React from "react";
import { LuFiles } from "react-icons/lu";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import Spinner from "../../../Spinner";
import { Search } from "lucide-react";
import _ from "lodash";

type ShareFilesType = {
  id: string;
  filename: string;
};

export function PickFile({ setFile, file }: any) {
  const { user } = useUser();

  //* Global states
  const [globalFiles, setGlobalFiles] = useAppStore((state) => [
    state.globalFiles,
    state.setGlobalFiles,
  ]);

  //* local state
  const [isOpen, setIsOpen] = React.useState(false);
  const [files, setFiles] = React.useState<FileType[]>([]);
  const [fetchingFiles, setFetchingFiles] = React.useState(false);

  //* Search function
  function debouncedSearch(term: string) {
    if (term) {
      const searchedFiles = globalFiles.filter((file) =>
        file.filename.toLowerCase().includes(term.toLowerCase())
      );
      setFiles(searchedFiles);
    } else {
      setFiles(globalFiles);
    }
  }
  const handleSearchFile = _.debounce(debouncedSearch, 500);

  //* Fetch files only once
  React.useEffect(() => {
    const fetchFiles = async () => {
      if (!user) return;
      setFetchingFiles(true);
      try {
        const docResults = await getDocs(
          collection(db, "users", user.id!, "files")
        );
        const newDocs: FileType[] = docResults.docs.map((doc) => ({
          id: doc.id,
          filename: doc.data().filename || doc.id,
          fullName: doc.data().fullName || doc.id,
          timestamp:
            new Date(doc.data().timestamp?.seconds * 1000) || undefined,
          downloadUrl: doc.data().downloadUrl,
          type: doc.data().type,
          size: doc.data().size,
        }));
        setFiles(newDocs);
        setGlobalFiles(newDocs);
      } catch (error) {
        console.error(error);
      } finally {
        setFetchingFiles(false);
      }
    };
    if (!files.length) {
      fetchFiles();
    }
  }, [files, setGlobalFiles, user]);

  function isURL(str: string) {
    // Regular expression for a URL
    var urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  
    // Test the string against the regular expression
    return urlRegex.test(str);
  }

  return (
    <Dialog onOpenChange={(isOpen) => setIsOpen(isOpen)} open={isOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant={file ? "default" : "outline"}
          size={"icon"}
        >
           <LuFiles size={15} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Available files</DialogTitle>
        </DialogHeader>
        <SearchFile handleSearchFile={handleSearchFile} />
        <div className="grid gap-4">
          {fetchingFiles ? (
            <Spinner />
          ) : files.length ? (
            ""
          ) : (
            "No files available"
          )}
          {files.map((card: ShareFilesType, index: number) => {
            return (
              <Button
                key={card.id}
                variant={card.filename === (isURL(file) ? new URL(file).searchParams.get("query") : file) ? "default" : "ghost"}
                className="justify-start"
                onClick={() => {
                  setFile(card.filename);
                  setIsOpen(false);
                }}
              >
                {index + 1}. {card.filename}
              </Button>
            );
          })}
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const SearchFile = ({ handleSearchFile }: any) => {
  return (
    <div className="relative dark:text-white text-black bg-transparent w-full">
      <span className="absolute inset-y-0 left-0 flex items-center pl-2">
        <Search size={18} />
      </span>
      <input
        type="search"
        name="searchQuery"
        className="py-[0.55rem] text-sm rounded-md pl-8 pr-2 focus:outline-none bg-transparent border-[1px] focus:border-white md:w-96 w-full"
        placeholder="Filename"
        onChange={(e) => {
          handleSearchFile(e.target.value);
        }}
        autoComplete="off"
      />
    </div>
  );
};
