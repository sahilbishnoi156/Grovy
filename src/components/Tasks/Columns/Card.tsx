import { CardProps, CardType } from "@/typings";
import React from "react";
import { DropIndicator } from "./DropIndicator";
import { motion } from "framer-motion";
import { useTaskStore } from "@/store/TaskStore";
import { DeleteCardModal } from "../Modals/DeleteCard";

export const Card = ({
  description,
  id,
  categoryId,
  handleDragStart,
  setCards,
}: CardProps) => {
  return (
    <div
      onDoubleClick={() => {
        useTaskStore.setState({ cardId: id });
        useTaskStore.setState({ isDeleteCardOpen: true });
      }}
    >
      <DeleteCardModal setCards={setCards}/>
      <DropIndicator beforeId={id} id={categoryId} />
      <motion.div
        layout
        layoutId={id}
        draggable="true"
        onDragStart={(e) => handleDragStart(e, { description, id, categoryId })}
        className="cursor-grab rounded border dark:border-neutral-700 border-neutral-400 dark:bg-neutral-800 bg-neutral-500 p-3 active:cursor-grabbing"
      >
        <p className="text-sm text-neutral-100">{description}</p>
      </motion.div>
    </div>
  );
};
