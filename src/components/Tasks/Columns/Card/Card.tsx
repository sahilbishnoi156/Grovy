import { CardProps } from "@/typings";
import React from "react";
import { DropIndicator } from "../DropIndicator";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useTaskStore } from "@/store/TaskStore";
import { CardOptionsModal } from "../../Modals/CardOptions";
import { FaLink } from "react-icons/fa6";
import { LuFiles } from "react-icons/lu";
import Link from "next/link";
import { cn } from "@/lib/utils";
import ShowTimeDifference from "./ShowTimeDifference";
import { PenIcon } from "lucide-react";

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
  const [cardStyle, setCardStyle] = React.useState("");
  const [originalX, setOriginalX] = React.useState(0);
  const x = useMotionValue(0);

  const handleTouchMove = (event: any) => {
    // Calculate the new x position based on touch movement
    const newX = event.touches[0].clientX - originalX;

    // Limit movement to 100px to the left
    if (newX < -100) {
      x.set(-100);
    } else if (newX > 0) {
      x.set(0);
    } else {
      x.set(newX);
    }
  };

  const OpenModal = () =>{
    if (id) {
      useTaskStore.setState({
        card: {
          id: id,
          categoryId: categoryId,
          link: link,
          file: file,
          description: description,
          timeBound: timeBound,
          timestamp: timestamp,
        },
      });
    }
    if(!useTaskStore.getState().isCardOptionsOpen){
      useTaskStore.setState({ isCardOptionsOpen: true });
    }
  }
  return (
    <motion.div
      onTouchStart={(event) => {
        setOriginalX(event.touches[0].clientX);
      }}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => {
        if (x.get() <= -100) {
          OpenModal();
        }
        x.set(0)
      }}
      style={{ x:x }}
      onDoubleClick={OpenModal}
      className="dur duration-150 relative"
    >
      <CardOptionsModal />
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
        <p className="text-sm text-neutral-900 dark:text-white whitespace-pre-wrap">
          {description}
        </p>
        {(link || file || timeBound) && (
          <div className="flex items-center gap-2 mt-[2px]">
            {timeBound?.end && (
              <ShowTimeDifference
                completeTime={timeBound}
                setCardStyle={setCardStyle}
              />
            )}
            {timeBound?.isCompleted && (
              <div className="text-green-400 text-xs">Completed</div>
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
    </motion.div>
  );
};
