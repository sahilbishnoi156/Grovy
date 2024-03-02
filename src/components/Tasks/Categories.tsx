"use client";
import React, { useState } from "react";
import { Column } from "./Columns/Column";
import { AddCategory } from "./AddCategory";
import { useTaskStore } from "@/store/TaskStore";
import { Button } from "../ui/button";
import Spinner from "../Spinner";
import { useCollection } from "react-firebase-hooks/firestore";
import { useUser } from "@clerk/nextjs";
import {
  collection,
  doc,
  orderBy,
  query,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/firebase";
import { CardType } from "@/typings";
import { MoreVertical } from "lucide-react";
import { FaPlus } from "react-icons/fa6";
import _, { isEqual } from "lodash";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";

export const Categories = ({
  skeletonCategoryFiles,
  skeletonCardFiles,
}: any) => {
  const { user } = useUser();

  // Global States
  const categories = useTaskStore((state) => state.categories);
  const cards = useTaskStore((state) => state.cards);

  // Loacl states
  const [tempCards, setTempCards] = useState<CardType[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Firebase Collections
  const [categoryDocs, loadingCategories, errorCategories] = useCollection(
    user &&
      query(
        collection(db, "users", user.id, "categories"),
        orderBy("timestamp", "asc")
      )
  );
  const [cardsDocs, loadingCards, errorCards] = useCollection(
    user &&
      query(
        collection(db, "users", user.id, "cards"),
        orderBy("timestamp", "desc")
      )
  );

  //* Categories Updated
  React.useEffect(() => {
    if (!categoryDocs) return;
    const files = categoryDocs.docs.map((doc) => {
      return {
        id: doc.id,
        title: doc.data().title,
        fullName: doc.data().fullName || doc.id,
        headingColor: doc.data().headingColor,
        timestamp: new Date(doc.data().timestamp?.seconds * 1000) || undefined,
      };
    });
    useTaskStore.setState({ categories: files });
  }, [categoryDocs]);

  //* Cards updated
  React.useEffect(() => {
    if (!cardsDocs) return;
    const files = cardsDocs.docs.map((doc) => {
      return {
        id: doc.id,
        description: doc.data().description,
        categoryId: doc.data().categoryId,
        timestamp: new Date(doc.data().timestamp?.seconds * 1000) || undefined,
      };
    });
    setTempCards(files);
    useTaskStore.setState({ cards: files });
  }, [cardsDocs]);

  const categoryChangedCards = () => {
    return tempCards.filter((tempCard) => {
      const existingCard = cards.find((card: any) => card.id === tempCard.id);
      return existingCard && existingCard.categoryId !== tempCard.categoryId;
    });
  };

  const updateChangedCards = async (changedCards: CardType[]) => {
    if (!user) return;
    try {
      const batch = writeBatch(db);

      for (const changedCard of changedCards) {
        const cardDocRef = doc(db, "users", user.id, "cards", changedCard.id);
        // Update the specific fields (e.g., categoryId)
        const updatedFields = {
          categoryId: changedCard.categoryId,
        };
        batch.update(cardDocRef, updatedFields);
      }

      // Commit the batch
      await batch.commit();
    } catch (error) {
      console.error("Error updating changed cards:", error);
    }
  };

  const saveChanges = async () => {
    if (!user) return;
    if (isSaving) return;
    setIsSaving(true);

    try {
      // Create a batch
      const batch = writeBatch(db);
      // Check for new cards and add them to the batch
      for (const tempCard of tempCards) {
        const existingCard = cards.find((card) => card.id === tempCard.id);
        if (!existingCard) {
          batch.set(doc(db, "users", user.id, "cards", tempCard.id), {
            ...tempCard,
            userId: user.id,
            timestamp: serverTimestamp(),
          });
        }
      }
      // Check for deleted cards and add them to the batch
      for (const globalCard of cards) {
        const tempCard = tempCards.find((card) => card.id === globalCard.id);
        if (!tempCard) {
          batch.delete(doc(db, "users", user.id, "cards", globalCard.id));
        }
      }

      const changedCards = categoryChangedCards();
      await updateChangedCards(changedCards);

      // Commit the batch
      await batch.commit();
    } catch (error) {
      console.error("Error while updating the data:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const debouncedSaveChanges = _.debounce(saveChanges, 3000);

  const isInitialMount = React.useRef(true);
  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      const saveTimeout = setTimeout(() => {
        if (!isEqual(tempCards, cards)) {
          debouncedSaveChanges();
        }
      }, 2000);

      return () => clearTimeout(saveTimeout);
    }
  }, [tempCards, cards, debouncedSaveChanges]);

  //! Skeletons
  if (categoryDocs?.docs.length === undefined) {
    return (
      <div className="p-4 flex flex-col min-h-screen">
        <div>
          <div className="mb-2">Total Categories {categories.length || 0}</div>
          <Button
            variant="secondary"
            className="flex items-center gap-2 group"
            disabled
          >
            Add Category{" "}
            <FaPlus className="group-hover:rotate-90 duration-300" />
          </Button>
        </div>
        <div className="h-10 my-1"></div>
        <div className="h-[.5px] w-full dark:bg-neutral-700 bg-neutral-500 mb-6"></div>
        <div className="flex gap-3 flex-wrap">
          {skeletonCategoryFiles.map((category: any) => {
            return (
              <div
                key={category.id}
                className="min-h-10 w-72 dark:bg-neutral-900 bg-neutral-500 rounded-sm animate-pulse p-3 flex flex-col gap-3"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className={`font-medium`}>TITLE</h3>
                  <div className="flex gap-1 items-center">
                    <span className="rounded text-sm text-neutral-400">0</span>
                    <MoreVertical className="text-neutral-400 hover:text-white" />
                  </div>
                </div>
                {tempCards.map((card: any) => {
                  if (category.id.toString() === card.categoryId.toString()) {
                    return (
                      <div
                        key={card.id}
                        className="h-10 w-full dark:bg-neutral-800 bg-neutral-600 rounded-sm"
                      ></div>
                    );
                  }
                })}
                <div className="flex gap-1 items-center text-xs">
                  Add card <FaPlus size={10} />
                </div>
                {skeletonCardFiles.map((card: any) => {
                  return (
                    <div
                      key={card.id}
                      className="h-10 w-full bg-neutral-600 rounded-sm"
                    ></div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  //! Main Content
  return (
    <div className="p-2 flex flex-col md:p-4">
      <div className="mt-4 md:mt-0">
        <AddCategory />
      </div>
      <div className="h-10 my-1">
        {isSaving && (
          <Button variant={"ghost"} className="flex gap-2 text-neutral-600">
            {" "}
            <Spinner height="h-3" width="w-3" color="text-neutral-600" /> Saving
          </Button>
        )}
      </div>
      <div className="h-[.5px] w-full bg-neutral-700 mb-6"></div>
      {categories.length <= 0 && <div>Nothing here</div>}
      {categories.length <= 3 && window.innerWidth > 920 ? (
        <ResizableCategories
          tempCards={tempCards}
          categories={categories}
          setTempCards={setTempCards}
        />
      ) : (
        <div className="flex gap-3 flex-wrap md:justify-start justify-center">
          {categories.map((category: any) => {
            return (
              <Column
                key={`${category.id}${category.title}`}
                title={category.title}
                id={category.id.toString()}
                headingColor={category.headingColor}
                cards={tempCards}
                setCards={setTempCards}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

const ResizableCategories = ({ categories, tempCards, setTempCards }: any) => {
  return (
    <ResizablePanelGroup direction="horizontal" className="w-full">
      {categories.map((category: any, index: number) => {
        return (
          <>
            <ResizablePanel
              key={`${category.id}${category.title}`}
              minSize={29}
            >
              <Column
                title={category.title}
                id={category.id.toString()}
                headingColor={category.headingColor}
                cards={tempCards}
                setCards={setTempCards}
              />
            </ResizablePanel>
            {index !== categories.length - 1 && <ResizableHandle withHandle />}
          </>
        );
      })}
    </ResizablePanelGroup>
  );
};
