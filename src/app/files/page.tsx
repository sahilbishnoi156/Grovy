import Dropzone from "@/components/Dropzone";
import TableWrapper from "@/components/table/TableWrapper";
import { db } from "@/firebase";
import { FileType } from "@/typings";
import { auth } from "@clerk/nextjs";
import { collection, getDocs } from "firebase/firestore";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Files | Grovy - Your personal library",
  description: "Simplify file sharing and storage with our secure file upload feature. Easily upload, manage, and share documents, images, and more. Enhance collaboration by seamlessly accessing and organizing your files. Experience the convenience of our user-friendly file upload solution for efficient team collaboration."
};


export default async function Files() {
  const { userId } : { userId: string | null }  = auth();
  const docResults = await getDocs(collection(db, "users", userId!, "files"));
  const skeletonFiles: FileType[] = docResults.docs.map((doc) => ({
    id: doc.id,
    filename: doc.data().filename || doc.id,
    fullName: doc.data().fullName || doc.id,
    timestamp: new Date(doc.data().timestamp?.seconds * 1000) || undefined,
    downloadUrl: doc.data().downloadUrl,
    type: doc.data().type,
    size: doc.data().size,
  }));
  
  return (
    <div className="p-2 md:p-8">
      <Dropzone/>
      <section className="px-0 mt-10 md:px-8">
        <TableWrapper skeletons={skeletonFiles} />
      </section>
    </div>  
  );
}
