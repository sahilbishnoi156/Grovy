import { CardProps } from "@/typings";
import React from "react";
import { DropIndicator } from "../DropIndicator";
import { motion } from "framer-motion";
import { useTaskStore } from "@/store/TaskStore";
import { DeleteCardModal } from "../../Modals/DeleteCard";
import { FaLink } from "react-icons/fa6";
import { LuFiles } from "react-icons/lu";
import Link from "next/link";
import { cn } from "@/lib/utils";
import ShowTimeDifference from "./ShowTimeDifference";

export const Card = ({
  description,
  id,
  categoryId,
  link,
  timeBound,
  timestamp,
  file,
  handleDragStart,
}: CardProps) => {
  const [cardStyle, setCardStyle] = React.useState('')

  return (
    <div
      onDoubleClick={() => {
        useTaskStore.setState({ cardId: id });
        useTaskStore.setState({ isDeleteCardOpen: true });
      }}
    >
      <DeleteCardModal />
      <DropIndicator beforeId={id} id={categoryId} />
      <motion.div
        layout
        layoutId={id}
        draggable="true"
        onDragStart={(e) => handleDragStart(e, { description, id, categoryId })}
        className={cn(
          cardStyle,
          "cursor-grab rounded border p-3 active:cursor-grabbing dark:bg-neutral-800 bg-neutral-300/50 hover:bg-neutral-300/70 hover:dark:bg-neutral-700/70",
          {
            "dark:border-neutral-700 border-neutral-300/70":
              categoryId !== "uncategorized",
          },
          {
            "dark:border-purple-400/40 border-purple-500 shadow-lg shadow-black/30":
              categoryId === "uncategorized",
          }
        )}
      >
        <p className="text-sm text-neutral-900 dark:text-white">
          {description}
        </p>
        {(link || file || timeBound) && (
          <div className="flex items-center gap-2 mt-[2px]">
            {timeBound && (
              <ShowTimeDifference
                timeBound={timeBound}
                timestamp={timestamp}
                setCardStyle={setCardStyle}
              />
            )}
            {link && (
              <a
                href={link || "/"}
                className="hover:text-blue-500 text-neutral-500 cursor-pointer"
                target="_blank"
              >
                <FaLink size={17} />
              </a>
            )}
            {file && (
              <Link
                href={file || "/"}
                className="hover:text-blue-500 text-neutral-500 cursor-pointer"
              >
                <LuFiles size={17} />
              </Link>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
