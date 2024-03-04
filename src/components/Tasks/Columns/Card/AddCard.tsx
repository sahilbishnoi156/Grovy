import { AddCardProps } from "@/typings";
import { motion } from "framer-motion";
import React, { FormEvent, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { CgFormatUppercase } from "react-icons/cg";
import { PickFile } from "./CardOptions/PickFiles";
import { DatePicker } from "./CardOptions/DatePicker";
import { AddLink } from "./CardOptions/AddLink";
import { usePathname } from "next/navigation";
export const AddCard = ({ id, setCards }: AddCardProps) => {
  const [text, setText] = useState("");
  const [link, setLink] = useState("");
  const [file, setFile] = useState("");
  const [date, setDate] = React.useState<Date>();
  const [adding, setAdding] = useState(false);
  const pathname = usePathname()

  const ref = React.useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim().length) return;

    const dateObject = date instanceof Date ? new Date(date.getTime()) : null;

    if (dateObject) {
      dateObject.setHours(23, 59, 59, 0);
    }

    const newCard = {
      id: Math.random().toString(),
      description: text.trim(),
      categoryId: id,
      ...(link?.trim()?.length && { link: link.trim() }),
      ...(date && { timeBound: dateObject as Date }),
      ...(file?.trim()?.length && {
        file: `${pathname.split('/')[0]}/files?query=${file.trim()}`,
      }),
    };
    setCards((pv) => [...pv, newCard]);
    setLink("");
    setText("");
    setFile("");
    setDate(undefined)
    setAdding(false);
  };

  //* Update text to uppercase and lowercase
  const updateInputText = () => {
    if (ref.current) {
      const start = ref.current.selectionStart;
      const end = ref.current.selectionEnd;
      const selectedText = text.substring(start, end);

      if (selectedText) {
        if (selectedText === selectedText.toLowerCase()) {
          const updatedText =
            text.substring(0, start) +
            selectedText.toUpperCase() +
            text.substring(end);
          setText(updatedText);
        } else {
          const updatedText =
            text.substring(0, start) +
            selectedText.toLowerCase() +
            text.substring(end);
          setText(updatedText);
        }
      } else {
        if (text === text.toLowerCase()) {
          setText(text.toUpperCase());
        } else {
          setText(text.toLowerCase());
        }
      }
    }
  };

  return (
    <>
      {adding ? (
        <motion.form layout onSubmit={handleSubmit}>
          <textarea
            onChange={(e) => setText(e.target.value)}
            value={text}
            autoFocus
            ref={ref}
            placeholder="Add new task..."
            className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm text-neutral-800 dark:text-neutral-50 placeholder-violet-300 focus:outline-0 outline-none"
          />
          <div className="flex gap-2 items-center">
            <AddLink setLink={setLink} link={link} />
            <PickFile setFile={setFile} file={file} />
            <DatePicker setDate={setDate} date={date} />
            <Button
              type="button"
              variant={"outline"}
              size={"icon"}
              onClick={updateInputText}
            >
              <CgFormatUppercase size={25} />
            </Button>
          </div>
          <div className="mt-1.5 flex items-center justify-end gap-1.5">
            <button
              onClick={() => setAdding(false)}
              className="px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:dark:text-neutral-50 hover:text-neutral-800"
            >
              Close
            </button>
            <Button
              type="submit"
              size={'xs'}
              className="text-xs"
            >
              <span>Add</span>
              <FiPlus />
            </Button>
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
