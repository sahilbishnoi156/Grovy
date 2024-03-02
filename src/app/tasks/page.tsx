import React from "react";
import { Categories } from "@/components/Tasks/Categories";
import { auth } from "@clerk/nextjs";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { CategoryType } from "@/typings";

export default async function pages() {
  const { userId } = auth();

  // getting Data from database
  const categoryDocs = await getDocs(collection(db, "users", userId!, "categories"));
  const cardsDocs = await getDocs(collection(db, "users", userId!, "cards"));

  // Getting array of data
  const skeletonCategoryFiles: CategoryType[] = categoryDocs.docs.map((doc) => ({
    id: doc.id,
    title: doc.data().title || doc.id,
    fullName: doc.data().fullName || doc.id,
    headingColor: doc.data().headingColor || doc.id,
    timestamp: new Date(doc.data().timestamp?.seconds * 1000) || undefined,
  })) || [];

  const skeletonCardFiles: CategoryType[] = cardsDocs.docs.map((doc) => ({
    id: doc.id,
    title: doc.data().title || doc.id,
    fullName: doc.data().fullName || doc.id,
    headingColor: doc.data().headingColor || doc.id,
    timestamp: new Date(doc.data().timestamp?.seconds * 1000) || undefined,
  })) || [];
  return <Categories skeletonCategoryFiles={skeletonCategoryFiles} skeletonCardFiles={skeletonCardFiles} />;
}
