import { Locale } from "@/i18n/config";
import { produce } from "immer";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
export interface localeStateType {
  locale: Locale;
  changeLocale: (locale: Locale) => void;
}
export const useLocaleStore = create<localeStateType>()(
  devtools(
    persist(
      (set) => ({
        locale: "en",
        changeLocale: (locale: Locale) =>
          set(
            produce((state: localeStateType) => {
              state.locale = locale;
            }),
          ),
      }),
      //options
      {
        name: "LocaleStore",
      },
    ),
    { name: "LocaleStore" },
  ),
);
