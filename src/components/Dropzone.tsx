"use client";
import { db, storage } from "@/firebase";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React from "react";
import DropzoneComponent from "react-dropzone";
import { toast } from "sonner";

export default function Dropzone() {
  const maxSize = 20971520;
  const [fileUploading, setFileUploading] = React.useState(false);
  const { isLoaded, isSignedIn, user } = useUser();

  // Upload file
  const uploadFile = async (selectedFile: File) => {
    if (fileUploading) return;
    if (!user) return;

    setFileUploading(true);

    const docRef = await addDoc(collection(db, "users", user.id, "files"), {
      userId: user.id,
      filename: selectedFile.name,
      fullName: user.fullName,
      profileImg: user.imageUrl,
      timestamp: serverTimestamp(),
      type: selectedFile.type,
      size: selectedFile.size,
    });

    const imageRef = ref(storage, `users/${user.id}/files/${docRef.id}`);

    uploadBytes(imageRef, selectedFile).then(async (snapshot) => {
      const downloadUrl = await getDownloadURL(imageRef);
      await updateDoc(doc(db, "users", user.id, "files", docRef.id), {
        downloadUrl: downloadUrl,
      });
    });
    try {
    } catch (error) {
      console.log(error);
    } finally {
      setFileUploading(false);
    }
  };

  // On file upload
  const OnFileDrop = (acceptedFiles: File[]) => {
    const promise = async () => {
      try {
        acceptedFiles.forEach((acceptedFile: File) => {
          const reader = new FileReader();
          reader.onabort = () => console.log("file reading was aborted");
          reader.onerror = () => console.log("file reading was failed");
          reader.onload = async () => {
            await uploadFile(acceptedFile);
          };
          reader.readAsArrayBuffer(acceptedFile);
        });
        return acceptedFiles;
      } catch (error) {
        console.log(error);
      }
    };
    toast.promise(promise, {
      loading: "Uploading...",
      success: (data) => {
        return `${data?.length! > 1 ? "Files" : "File"} Uploading Complete.`;
      },
      error: "Error",
    });
  };
  return (
    <DropzoneComponent onDrop={OnFileDrop} minSize={0} maxSize={maxSize}>
      {({
        getRootProps,
        getInputProps,
        isDragActive,
        isDragReject,
        fileRejections,
      }) => {
        const isFileTooLarge =
          fileRejections.length > 0 && fileRejections[0].file.size > maxSize;
        return (
          <section>
            <div
              {...getRootProps()}
              className={cn(
                "w-full h-52 flex justify-center items-center p-5 border border-dashed rounded-lg text-center border-neutral-700 flex-col cursor-pointer",
                isDragActive ? "border-white bg-neutral-600" : ""
              )}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                !isDragReject ? (
                  <p>Drop to upload this file</p>
                ) : (
                  ""
                )
              ) : (
                <p>Click here or drop a file to upload</p>
              )}
              {isFileTooLarge && (
                <div className="text-red-500 mt-2">File is too large</div>
              )}
            </div>
          </section>
        );
      }}
    </DropzoneComponent>
  );
}
