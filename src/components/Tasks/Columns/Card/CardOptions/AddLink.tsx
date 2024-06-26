import React from "react";
import { FaLink } from "react-icons/fa6";

export const AddLink = ({ setLink, link }: any) => {
  const [showLink, setShowLink] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const handleShowLink = () => {
    setShowLink(!showLink);
    if(inputRef.current){
      inputRef.current.focus();
    }
  };
  return (
    <>
      <label htmlFor="voice-search" className="sr-only">
        Search
      </label>
      <div className="relative group">
        <div
          className="absolute inset-y-0 start-0 flex items-center ps-3 h-full w-10 rounded-md cursor-pointer z-[1]"
          onClick={() => handleShowLink()}
        />
        <div className="absolute inset-y-0 start-0 flex items-center ps-3">
          <FaLink className={`${!showLink && link && "invert"}`} />
        </div>
        <input
          type="text"
          id="voice-search"
          className={`bg-transparent border text-gray-900 text-sm rounded-lg block p-2.5 dark:text-white duration-200 ${
            !showLink
              ? `w-10 ps-4 placeholder:text-transparent ${
                  link
                    ? "bg-black dark:bg-white group-hover:dark:bg-white/80 group-hover:bg-black/80"
                    : "group-hover:dark:bg-neutral-800 group-hover:bg-neutral-200/50"
                }`
              : "ps-10 w-fit"
          } `}
          ref={inputRef}
          placeholder="Link"
          autoFocus
          defaultValue={link}
          autoComplete="off"
          disabled={!showLink}
          onChange={(e) => setLink(e.target.value)}
          required={showLink}
        />
      </div>
    </>
  );
};
