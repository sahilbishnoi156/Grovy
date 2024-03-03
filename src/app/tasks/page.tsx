import React from "react";
import { Categories } from "@/components/Tasks/Categories";
import { auth } from "@clerk/nextjs";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase";
import { CardType, CategoryType } from "@/typings";
import ErrorBoundary from "@/components/ErroBoundry";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tasks | Grovy - Your personal library",
  description: "Optimize your workflow with our advanced task management features. Effortlessly organize, prioritize, and track your tasks for enhanced productivity. Experience seamless collaboration and efficient task completion on our intuitive platform designed to elevate your project management."
};

export default async function pages() {
  const { userId }: { userId: string | null } = auth();
  // getting Data from database
  const categoryDocs = await getDocs(
    query(
      collection(db, "users", userId!, "categories"),
      orderBy("timestamp", "asc")
    )
  );

  const cardsDocs = await getDocs(collection(db, "users", userId!, "cards"));

  // Getting array of data
  const skeletonCategoryFiles: CategoryType[] =
    categoryDocs.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title || doc.id,
      fullName: doc.data().fullName || doc.id,
      headingColor: doc.data().headingColor || doc.id,
      timestamp: new Date(doc.data().timestamp?.seconds * 1000) || undefined,
    })) || [];

  const skeletonCardFiles: CardType[] =
    cardsDocs.docs.map((doc) => ({
      id: doc.id,
      description: doc.data().description || "TITLE",
      headingColor: doc.data().headingColor || "text-white",
      link: doc.data().link || undefined,
      file: doc.data().file || undefined,
      categoryId: doc.data().categoryId || "uncategorized",
      timestamp: new Date(doc.data().timestamp?.seconds * 1000) || undefined,
    })) || [];
  return (
    <ErrorBoundary>
      <Categories
        skeletonCategoryFiles={skeletonCategoryFiles}
        skeletonCardFiles={skeletonCardFiles}
      />
    </ErrorBoundary>
  );
}
