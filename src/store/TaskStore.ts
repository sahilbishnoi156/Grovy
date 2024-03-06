import { CardType, CategoryType } from "@/typings";
import { create } from "zustand";

type State = {
  categories: CategoryType[];
  cards: CardType[];
  currentCategoryId: string | null;
  categoryName: string;
  categoryColor: string;
  card: CardType | null;
  isDeleteCategoryOpen: boolean;
  isRenameCategoryOpen: boolean;
  isCardOptionsOpen: boolean;
};

type Action = {
  addCategory: (data: CategoryType) => void;
  setCategories: (categories: CategoryType[]) => void;
  setCards: (cards: CardType[]) => void;
  setCurrentCategoryId: (CurrentCategoryId: string) => void;
  setIsDeleteCategoryOpen: (open: boolean) => void;
  setIsRenameCategoryOpen: (open: boolean) => void;
  setIsCardOptionsOpen: (open: boolean) => void;
  setCategoryName: (categoryName: string) => void;
  setCategoryColor: (categoryColor: string) => void;
  setCard: (card: CardType) => void;
};

export const useTaskStore = create<State & Action>()((set) => ({
  //* Categories
  categories: [],
  setCategories: (categories: CategoryType[]) =>
    set(() => ({ categories: categories })),
  addCategory: (data: CategoryType) => {
    return set((state) => ({
      categories: [...state.categories, data],
    }));
  },

  //* Cards
  cards: [],
  setCards: (newCards: CardType[]) => {
    set(() => ({ cards: newCards }));
  },

  //* Modals and categoryID
  currentCategoryId: null,
  setCurrentCategoryId: (currentCategoryId: string) =>
    set(() => ({ currentCategoryId: currentCategoryId })),

  isDeleteCategoryOpen: false,
  setIsDeleteCategoryOpen: (open: boolean) =>
    set(() => ({ isDeleteCategoryOpen: open })),

  isRenameCategoryOpen: false,
  setIsRenameCategoryOpen: (open: boolean) =>
    set(() => ({ isRenameCategoryOpen: open })),

  categoryName: "",
  setCategoryName: (categoryName: string) =>
    set(() => ({ categoryName: categoryName })),

  categoryColor: "",
  setCategoryColor: (categoryColor: string) =>
    set(() => ({ categoryColor: categoryColor })),

  isCardOptionsOpen: false,
  setIsCardOptionsOpen: (isCardOptionsOpen: boolean) =>
    set(() => ({ isCardOptionsOpen: isCardOptionsOpen })),

  card: null,
  setCard: (card: CardType ) => set(() => ({ card: card })),
}));
