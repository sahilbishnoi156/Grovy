import Dropzone from "@/components/Dropzone";
import TableWrapper from "@/components/table/TableWrapper";
import { db } from "@/firebase";
import { FileType } from "@/typings";
import { auth } from "@clerk/nextjs";
import { collection, getDocs } from "firebase/firestore";
import React from "react";
import { toast } from "sonner";

export default async function Dashboard() {
  const { userId } = auth();
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
    <div className="p-8">
      <Dropzone />
      <section className="container mt-10">
        <TableWrapper skeletons={skeletonFiles} />
      </section>
    </div>
  );
}
