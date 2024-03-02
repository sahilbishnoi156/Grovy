import { Dispatch, MouseEventHandler, SetStateAction } from "react";
import { z } from "zod";

export type ColumnType = "backlog" | "todo" | "doing" | "done";

export type CardType = {
  id: string;
  description: string;
  categoryId: string;
  timestamp?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export type CategoryType = {
  id: string;
  title: string;
  headingColor: string;
  fullName?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
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
  headingColor: z.string().min(2, "Title Is Invalid").max(255).default('text-white'),
});

export type FileType = {
  id: string;
  filename: string;
  fullName: string;
  timestamp: Date;
  downloadUrl: string;
  type: string;
  size: number;
}