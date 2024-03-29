import { Timestamp } from "firebase/firestore";
import { Dispatch, MouseEventHandler, SetStateAction } from "react";
import { FieldValue } from "react-hook-form";
import { z } from "zod";

export type ColumnType = "backlog" | "todo" | "doing" | "done";

export type CardType = {
  id: string;
  description: string;
  categoryId: string;
  timestamp?: Date;
  timeBound?: {
    start: Timestamp,
    end: Date,
    isCompleted: boolean
  };
  link?: string;
  file?: string;
};

export type CategoryType = {
  id: string;
  title: string;
  headingColor: string;
  fullName?: string;
};

export type ColumnProps = {
  title: string;
  headingColor: string;
  cards: CardType[];
  id: string;
  setCards: Dispatch<SetStateAction<CardType[]>>;
};

export type CardProps = CardType & {
  handleDragStart: Function;
  setCards: Function;
};

export type DropIndicatorProps = {
  beforeId: string | null;
  id: string;
};

export type AddCardProps = {
  id: string;
  setCards: Dispatch<SetStateAction<CardType[]>>;
};

export const CategorySchema = z.object({
  title: z.string().min(2, "Title Is Invalid").max(255),
  headingColor: z
    .string().optional().transform((e) => (e === "" ? undefined : e)),
});

export type FileType = {
  id: string;
  filename: string;
  fullName: string;
  timestamp: Date;
  downloadUrl: string;
  type: string;
  size: number;
};
