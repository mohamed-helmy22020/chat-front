import { produce } from "immer";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
export type PageType =
  | "chat"
  | "status"
  | "friends"
  | "blocks"
  | "settings"
  | "profile";
export interface pageStateType {
  page: PageType;
  setPage: (page: PageType) => void;
}
export const usePageStore = create<pageStateType>()(
  devtools(
    persist(
      (set) => ({
        page: "chat",
        setPage: (page: PageType) =>
          set(
            produce((state: pageStateType) => {
              state.page = page;
            }),
          ),
      }),
      //options
      {
        name: "pageStore",
      },
    ),
    { name: "pageStore" },
  ),
);
