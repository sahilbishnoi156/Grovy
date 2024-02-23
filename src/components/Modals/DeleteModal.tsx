"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { db, storage } from "@/firebase";
import { useAppStore } from "@/store/store";
import { useUser } from "@clerk/nextjs";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { toast } from "sonner";

export function DeleteModal() {
  const { user } = useUser();
  const [setIsDeletingModalOpen, isDeletingModalOpen, fileId, setFileId] =
    useAppStore((state) => [
      state.setIsDeletingModalOpen,
      state.isDeletingModalOpen,
      state.fileId,
      state.setFileId,
    ]);

  const deleteFile = async () => {
    const promise = async () => {
      if (!user || !fileId) return;
      try {
        const fileRef = ref(storage, `users/${user.id}/files/${fileId}`);
        await deleteObject(fileRef).then(async () => {
          deleteDoc(doc(db, "users", user.id, "files", fileId)).then(() => {});
        });
      } catch (error) {
        console.log(error);
      } finally {
        setIsDeletingModalOpen(false);
      }
    };

    toast.promise(promise, {
      loading: "Deleting...",
      success: (data) => {
        return `File has been Deleted.`;
      },
      error: "Error",
    });
  };

  return (
    <Dialog
      open={isDeletingModalOpen}
      onOpenChange={(isOpen) => {
        setIsDeletingModalOpen(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            file.!
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsDeletingModalOpen(false)}
          >
            <span className="sr-only">Close</span>
            <span>Close</span>
          </Button>
          <Button type="button" variant="danger" onClick={() => deleteFile()}>
            <span className="sr-only">Delete</span>
            <span>Delete</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
