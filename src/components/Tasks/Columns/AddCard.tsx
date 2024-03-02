import { AddCardProps } from "@/typings";
import { motion } from "framer-motion";
import { FormEvent, useState } from "react";
import { FiPlus } from "react-icons/fi";

export const AddCard = ({ id, setCards }: AddCardProps) => {
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!text.trim().length) return;

    const newCard = {
      id: Math.random().toString(),
      description: text.trim(),
      categoryId: id,
    };

    setCards((pv) => [...pv, newCard]);

    setAdding(false);
  };

  return (
    <>
      {adding ? (
        <motion.form layout onSubmit={handleSubmit}>
          <textarea
            onChange={(e) => setText(e.target.value)}
            autoFocus
            placeholder="Add new task..."
            className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm text-neutral-800 dark:text-neutral-50 placeholder-violet-300 focus:outline-0 outline-none"
          />
          <div className="mt-1.5 flex items-center justify-end gap-1.5">
            <button
              onClick={() => setAdding(false)}
              className="px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:dark:text-neutral-50 hover:text-neutral-800"
            >
              Close
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded bg-neutral-50 px-3 py-1.5 text-xs text-neutral-950 transition-colors hover:bg-neutral-300"
            >
              <span>Add</span>
              <FiPlus />
            </button>
          </div>
        </motion.form>
      ) : (
        <motion.button
          layout
          onClick={() => setAdding(true)}
          className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-600 transition-colors hover:dark:text-neutral-50 hover:text-neutral-800 group"
        >
          <span>Add card</span>
          <FiPlus className="group-hover:rotate-90 duration-300" />
        </motion.button>
      )}
    </>
  );
};
