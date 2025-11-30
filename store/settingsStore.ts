import { produce } from "immer";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
export interface settingsStateType {
  isFocus: boolean;
  isLoadingData: boolean;
  loadingProgress: number;
  changeIsFocus: (isFocus: boolean) => void;
  changeIsLoadingData: (isLoadingData: boolean) => void;
  changeLoadingProgress: (loadingProgress: number) => void;
  addLoadingProgress: (progress: number) => void;
}
export const useSettingsStore = create<settingsStateType>()(
  devtools(
    (set) => ({
      isFocus: true,
      isLoadingData: true,
      loadingProgress: 0,
      changeIsFocus: (isFocus: boolean) =>
        set(
          produce((state: settingsStateType) => {
            state.isFocus = isFocus;
          }),
        ),
      changeIsLoadingData: (isLoadingData: boolean) =>
        set(
          produce((state: settingsStateType) => {
            state.isLoadingData = isLoadingData;
          }),
        ),
      changeLoadingProgress: (loadingProgress: number) =>
        set(
          produce((state: settingsStateType) => {
            state.loadingProgress = loadingProgress;
          }),
        ),
      addLoadingProgress: (progress: number) =>
        set(
          produce((state: settingsStateType) => {
            state.loadingProgress += progress;
          }),
        ),
    }),

    { name: "SettingsStore" },
  ),
);
