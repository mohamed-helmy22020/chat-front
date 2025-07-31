import { produce } from "immer";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
export interface userStateType {
  user: UserType | null;
  changeUserData: (user: any) => void;
  logout: () => void;
}
export const useUserStore = create<userStateType>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        changeUserData: (user: any) =>
          set(
            produce((state: userStateType) => {
              state.user = {
                ...state.user,
                ...user,
              };
            }),
          ),
        logout: () =>
          set(
            produce((state: userStateType) => {
              state.user = null;
            }),
          ),
      }),
      //options
      {
        name: "UserDataStore",
        onRehydrateStorage: () => {
          console.log("hydration starts");

          return (state, error) => {
            if (error) {
              console.log("an error happened during hydration", error);
            } else {
              console.log("hydration finished");
            }
          };
        },
      },
    ),
    { name: "UserDataStore" },
  ),
);
