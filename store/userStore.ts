import { produce } from "immer";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
export interface userStateType {
  user: UserType | null;
  friendsList: RequestUserType[];
  sentRequestsList: RequestUserType[];
  receivedRequestsList: RequestUserType[];
  blockedList: RequestUserType[];
  changeUserSettings: (newUserSettings: UserSettingsType) => void;
  changeUserData: (newUserData: Partial<UserType>) => void;
  setFriendsList(friends: RequestUserType[]): void;
  setSentRequestsList(requests: RequestUserType[]): void;
  setReceivedRequestsList(requests: RequestUserType[]): void;
  setBlockedList(requests: RequestUserType[]): void;
  changeFriendsOnlineStatus(userId: string, isOnline: boolean): void;
  logout: () => void;
}
export const useUserStore = create<userStateType>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        userSettings: null,
        friendsList: [],
        sentRequestsList: [],
        receivedRequestsList: [],
        blockedList: [],
        changeUserSettings: (newUserSettings: UserSettingsType) =>
          set(
            produce((state: userStateType) => {
              if (!state.user) return;
              state.user.settings = newUserSettings;
            }),
          ),
        setBlockedList: (requests: RequestUserType[]) =>
          set(
            produce((state: userStateType) => {
              state.blockedList = requests;
            }),
          ),
        setSentRequestsList: (requests: RequestUserType[]) =>
          set(
            produce((state: userStateType) => {
              state.sentRequestsList = requests;
            }),
          ),
        setReceivedRequestsList: (requests: RequestUserType[]) =>
          set(
            produce((state: userStateType) => {
              state.receivedRequestsList = requests;
            }),
          ),
        setFriendsList: (friends: RequestUserType[]) =>
          set(
            produce((state: userStateType) => {
              state.friendsList = friends;
            }),
          ),
        changeUserData: (newUserData: any) =>
          set(
            produce((state: userStateType) => {
              state.user = {
                ...state.user,
                ...newUserData,
              };
            }),
          ),
        changeFriendsOnlineStatus: (userId: string, isOnline: boolean) =>
          set(
            produce((state: userStateType) => {
              const friendIndex = state.friendsList.findIndex(
                (f) => f._id === userId,
              );
              if (friendIndex > -1) {
                state.friendsList[friendIndex].isOnline = isOnline;
              }
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
