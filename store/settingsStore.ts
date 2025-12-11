import { produce } from "immer";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
export interface settingsStateType {
  isFocus: boolean;
  isLoadingData: boolean;
  loadingProgress: number;
  notifcationsSettings: NotificationsSettingsType;
  changeNotifcationsSettings: (
    notifcationsSettings: NotificationsSettingsType,
  ) => void;
  changeIsFocus: (isFocus: boolean) => void;
  changeIsLoadingData: (isLoadingData: boolean) => void;
  changeLoadingProgress: (loadingProgress: number) => void;
  addLoadingProgress: (progress: number) => void;
  resetSettings: () => void;
}
export const useSettingsStore = create<settingsStateType>()(
  devtools(
    persist(
      (set) => ({
        isFocus: true,
        isLoadingData: true,
        loadingProgress: 0,
        notifcationsSettings: {
          messages: "Enable",
          previews: "Enable",
          reactions: "Enable",
          incomingCalls: "Enable",
          incomingMessagesSound: "Enable",
          incomingCallsSound: "Enable",
        },
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
              if (state.loadingProgress >= 100) {
                state.isLoadingData = false;
                state.loadingProgress = 100;
              }
            }),
          ),
        changeNotifcationsSettings: (
          notifcationsSettings: NotificationsSettingsType,
        ) =>
          set(
            produce((state: settingsStateType) => {
              state.notifcationsSettings = notifcationsSettings;
            }),
          ),
        resetSettings: () =>
          set(
            produce((state: settingsStateType) => {
              state.isFocus = true;
              state.isLoadingData = true;
              state.loadingProgress = 0;
              state.notifcationsSettings = {
                messages: "Enable",
                previews: "Enable",
                reactions: "Enable",
                incomingCalls: "Enable",
                incomingMessagesSound: "Enable",
                incomingCallsSound: "Enable",
              };
            }),
          ),
      }),
      {
        name: "SettingsStore",
        partialize: (state) => ({
          notifcationsSettings: state.notifcationsSettings,
        }),
      },
    ),

    { name: "SettingsStore" },
  ),
);
