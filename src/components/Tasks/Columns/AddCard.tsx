import { AddCardProps } from "@/typings";
import { motion } from "framer-motion";
import React, { FormEvent, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { FaLink } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { CgFormatUppercase } from "react-icons/cg";
import { LuFiles } from "react-icons/lu";
import { PickFile } from "../Modals/PickFiles";

export const AddCard = ({ id, setCards }: AddCardProps) => {
  const [text, setText] = useState("");
  const [link, setLink] = useState("");
  const [file, setFile] = useState("");
  const [adding, setAdding] = useState(false);

  const ref = React.useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim().length) return;

    const newCard = {
      id: Math.random().toString(),
      description: text.trim(),
      categoryId: id,
      ...(link?.trim()?.length && { link: link.trim() }),
      ...(file?.trim()?.length && { file: `https://grovy.vercel.app/files?query=${file.trim()}` }),
    };
    setCards((pv) => [...pv, newCard]);
    setLink("");
    setText("");
    setFile("");
    setAdding(false);
  };

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
        }else{
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
            <LinkComponent setLink={setLink} />
            <Button
              type="button"
              variant={"outline"}
              size={"icon"}
              onClick={updateInputText}
            >
              <CgFormatUppercase size={25} />
            </Button>
            <PickFile setFile={setFile} file={file}/>
          </div>
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

const LinkComponent = ({ setLink }: any) => {
  const [showLink, setShowLink] = useState(false);
  return (
    <>
      <label htmlFor="voice-search" className="sr-only">
        Search
      </label>
      <div className="relative group">
        <div
          className="absolute inset-y-0 start-0 flex items-center ps-3 h-full w-10 rounded-md cursor-pointer z-[1]"
          onClick={() => setShowLink(!showLink)}
        />
        <div className="absolute inset-y-0 start-0 flex items-center ps-3">
          <FaLink />
        </div>
        <input
          type="text"
          id="voice-search"
          className={`bg-transparent border text-gray-900 text-sm rounded-lg block p-2.5 dark:text-white duration-200 ${
            !showLink
              ? "w-10 ps-4 placeholder:text-transparent group-hover:bg-neutral-800"
              : "ps-10 w-fit"
          } `}
          placeholder="Link"
          autoFocus
          autoComplete="off"
          disabled={!showLink}
          onChange={(e) => setLink(e.target.value)}
          required={showLink}
        />
      </div>
    </>
  );
};
