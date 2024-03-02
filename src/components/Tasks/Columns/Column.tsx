import { CardType, ColumnProps } from "@/typings";
import React, { useState, DragEvent } from "react";
import { Card } from "./Card";
import { DropIndicator } from "./DropIndicator";
import { AddCard } from "./AddCard";
import { TaskDropDown } from "@/components/DropDown";
import { useTaskStore } from "@/store/TaskStore";
import { DeleteCategoryModal } from "../Modals/DeleteCategory";
import { RenameCategoryModal } from "../Modals/RenameCategory";

export const Column = ({
  id,
  title,
  headingColor,
  cards,
  setCards,
}: ColumnProps) => {
  const [active, setActive] = useState(false);
  const [setIsDeletingModalOpen, setIsRenameCategoryOpen] = useTaskStore(
    (state) => [state.setIsDeleteCategoryOpen, state.setIsRenameCategoryOpen]
  );

  const handleDragStart = (e: DragEvent, card: CardType) => {
    e.dataTransfer.setData("cardId", card.id);
  };

  const handleDragEnd = (e: DragEvent) => {
    const cardId = e.dataTransfer.getData("cardId") as string;

    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element.dataset.before || "-1";

    if (before !== cardId) {
      let copy = [...cards];

      let cardToTransfer = copy.find((c) => c.id.toString() === cardId);
      if (!cardToTransfer) return;
      cardToTransfer = { ...cardToTransfer, categoryId: id };
      copy = copy.filter((c) => c.id.toString() !== cardId);
      const moveToBack = before === "-1";

      if (moveToBack) {
        copy.push(cardToTransfer);
      } else {
        const insertAtIndex = copy.findIndex(
          (el) => el.id.toString() === before
        );
        if (insertAtIndex === undefined) return;

        copy.splice(insertAtIndex, 0, cardToTransfer);
      }

      setCards(copy);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    highlightIndicator(e);

    setActive(true);
  };

  const clearHighlights = (els?: HTMLElement[]) => {
    const indicators = els || getIndicators();

    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e: DragEvent) => {
    const indicators = getIndicators();

    clearHighlights(indicators);

    const el = getNearestIndicator(e, indicators);

    el.element.style.opacity = "1";
  };

  const getNearestIndicator = (e: DragEvent, indicators: HTMLElement[]) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();

        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );

    return el;
  };

  const getIndicators = () => {
    return Array.from(
      document.querySelectorAll(`[data-id="${id}"]`) as unknown as HTMLElement[]
    );
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const filteredCards = cards.filter(
    (c) => c.categoryId.toString() === id.toString()
  );

  const openDeleteModal = () => {
    useTaskStore.setState({ currentCategoryId: id });
    setIsDeletingModalOpen(true);
  };
  const openRenameModal = () => {
    useTaskStore.setState({ currentCategoryId: id });
    useTaskStore.setState({ categoryName: title });
    useTaskStore.setState({ categoryColor: headingColor });
    setIsRenameCategoryOpen(true);
  };

  return (
    <div className="min-w-72 w-full shrink-0 flex-1 md:px-3 mb-10">
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`font-medium ${headingColor}`}>
          {title}{" "}
          <span className="rounded text-sm text-neutral-400 ml-2">
            {filteredCards.length}
          </span>
        </h3>
        <div className="flex gap-1 items-center">
          <TaskDropDown
            openDeleteModal={openDeleteModal}
            openRenameModal={openRenameModal}
          />
        </div>
      </div>
      <DeleteCategoryModal />
      <RenameCategoryModal />
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full transition-colors ${
          active
            ? "bg-neutral-800/20 dark:bg-neutral-800/50"
            : "bg-neutral-800/0"
        }`}
      >
        {filteredCards.map((c) => {
          return (
            <Card
              key={c.id}
              {...c}
              handleDragStart={handleDragStart}
              setCards={setCards}
            />
          );
        })}
        <DropIndicator beforeId={null} id={id.toString()} />
        <AddCard id={id.toString()} setCards={setCards} />
      </div>
    </div>
  );
};
