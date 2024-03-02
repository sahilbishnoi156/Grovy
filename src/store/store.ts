import { FileType } from "@/typings";
import { create } from "zustand";

interface AppState {
  isDeletingModalOpen: boolean;
  setIsDeletingModalOpen: (open: boolean) => void;

  isRenameModalOpen: boolean;
  setIsRenameModalOpen: (open: boolean) => void;

  fileId: string | null;
  setFileId: (fileId: string) => void;

  filename: string;
  setFilename: (filename: string) => void;

  currentFilter: string;
  setCurrentFilter: (currentFilter: string) => void;

  currentSort: string;
  setCurrentSort: (currentSort: string) => void;

  globalFiles: FileType[];
  setGlobalFiles: (globalFiles: FileType[]) => void;

  generatedFiltersByFiles: string[];
  setGeneratedFiltersByFiles: (generatedFiltersByFiles: string[]) => void;
}

export const useAppStore = create<AppState>()((set) => ({
  fileId: null,
  setFileId: (fileId: string) => set((state) => ({ fileId })),

  filename: "",
  setFilename: (filename: string) => set((state) => ({ filename })),

  isDeletingModalOpen: false,
  setIsDeletingModalOpen: (open: boolean) =>
    set((state) => ({ isDeletingModalOpen: open })),

  isRenameModalOpen: false,
  setIsRenameModalOpen: (open: boolean) =>
    set((state) => ({ isRenameModalOpen: open })),

  currentFilter: "",
  setCurrentFilter: (currentFilter: string) =>
    set(() => ({ currentFilter: currentFilter })),

  currentSort: "desc",
  setCurrentSort: (currentSort: string) =>
    set(() => ({ currentSort: currentSort })),

  globalFiles: [],
  setGlobalFiles: (globalFiles: FileType[]) =>
    set(() => ({ globalFiles: globalFiles })),

  generatedFiltersByFiles: [],
  setGeneratedFiltersByFiles: (generatedFiltersByFiles: string[]) =>
    set(() => ({ generatedFiltersByFiles: generatedFiltersByFiles })),
}));
