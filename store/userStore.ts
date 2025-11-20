import { produce } from "immer";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
export interface userStateType {
  user: UserType | null;
  friendsList: RequestUserType[];
  sentRequestsList: RequestUserType[];
  receivedRequestsList: RequestUserType[];
  blockedList: RequestUserType[];
  changeUserData: (user: Partial<UserType>) => void;
  setFriendsList(friends: RequestUserType[]): void;
  setSentRequestsList(requests: RequestUserType[]): void;
  setReceivedRequestsList(requests: RequestUserType[]): void;
  setBlockedList(requests: RequestUserType[]): void;
  logout: () => void;
}
export const useUserStore = create<userStateType>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        friendsList: [],
        sentRequestsList: [],
        receivedRequestsList: [],
        blockedList: [],
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
