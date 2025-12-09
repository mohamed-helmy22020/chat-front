import { produce } from "immer";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
export interface statusStateType {
  userStatuses: UserStatusType[];
  friendsStatuses: FriendsStatusType[];
  currentStatus: CurrentStatusType | null;
  currentStatusTime: number;
  currentStatusInterval: number;
  isPlaying: boolean;
  isMuted: boolean;
  previousStatus: () => void;
  nextStatus: () => void;
  seeStatus: (statusId: string) => void;
  userStausSeen: (statusId: string, user: MiniUserType) => void;
  changeUserStatuses: (statuses: UserStatusType[]) => void;
  addUserStatus: (status: UserStatusType) => void;
  deleteUserStatus: (statusId: string) => void;
  addFriendStatus: (status: FriendsStatusType) => void;
  deleteFriendStatus: (statusId: string) => void;
  changeFriendsStatuses: (statuses: FriendsStatusType[]) => void;
  changeCurrentStatus: (userId: string | null, isMe?: boolean) => void;
  changeCurrentStatusTime: (time: number) => void;
  changeCurrentStatusInterval: (interval: number) => void;
  changeIsPlaying: (isPlaying: boolean) => void;
  changeIsMuted: (isMuted: boolean) => void;
  resetStatus: () => void;
}
export const useStatusStore = create<statusStateType>()(
  devtools(
    (set) => ({
      currentStatus: null,
      userStatuses: [],
      friendsStatuses: [],
      currentStatusTime: 0,
      currentStatusInterval: 0,
      isPlaying: true,
      isMuted: false,
      previousStatus: () =>
        set(
          produce((state: statusStateType) => {
            if (!state.currentStatus) return;
            const prevIndex = state.currentStatus.currentIndex - 1;
            if (prevIndex < 0) {
              return;
            }
            state.currentStatus.currentIndex = prevIndex;

            state.isPlaying = true;
            state.currentStatusTime = 0;
            state.currentStatusInterval =
              state.currentStatus.statuses[state.currentStatus.currentIndex]
                .mediaType === "video"
                ? 0
                : 5000;
          }),
        ),

      nextStatus: () =>
        set(
          produce((state: statusStateType) => {
            if (!state.currentStatus) return;

            const nextIndex = state.currentStatus.currentIndex + 1;

            if (nextIndex > state.currentStatus.count - 1) {
              state.currentStatus = null;
              return;
            }
            state.currentStatus.currentIndex = nextIndex;

            state.isPlaying = true;
            state.currentStatusTime = 0;
            state.currentStatusInterval =
              state.currentStatus.statuses[state.currentStatus.currentIndex]
                .mediaType === "video"
                ? 0
                : 5000;
          }),
        ),
      seeStatus: (statusId: string) =>
        set(
          produce((state: statusStateType) => {
            for (let i = 0; i < state.friendsStatuses.length; i++) {
              if (state.friendsStatuses[i]._id === statusId) {
                state.friendsStatuses[i].isSeen = true;
                break;
              }
            }
          }),
        ),
      userStausSeen: (statusId: string, user: MiniUserType) =>
        set(
          produce((state: statusStateType) => {
            const status = state.userStatuses.find(
              (status) => status._id === statusId,
            );
            if (
              status &&
              status.viewers.findIndex((v) => v.user._id === user._id) === -1
            ) {
              status.viewers.push({
                user,
                createdAt: new Date().toISOString(),
              });
            }
          }),
        ),
      changeCurrentStatusInterval: (interval: number) =>
        set(
          produce((state: statusStateType) => {
            state.currentStatusInterval = Math.floor(interval);
          }),
        ),
      changeUserStatuses: (statuses: UserStatusType[]) =>
        set(
          produce((state: statusStateType) => {
            state.userStatuses = statuses;
          }),
        ),
      addUserStatus: (status: UserStatusType) =>
        set(
          produce((state: statusStateType) => {
            state.userStatuses.push(status);
          }),
        ),
      deleteUserStatus: (statusId: string) =>
        set(
          produce((state: statusStateType) => {
            state.userStatuses = state.userStatuses.filter(
              (status) => status._id !== statusId,
            );
          }),
        ),
      addFriendStatus: (status: FriendsStatusType) =>
        set(
          produce((state: statusStateType) => {
            state.friendsStatuses.push(status);
          }),
        ),
      deleteFriendStatus: (statusId: string) =>
        set(
          produce((state: statusStateType) => {
            state.friendsStatuses = state.friendsStatuses.filter(
              (status) => status._id !== statusId,
            );
          }),
        ),

      changeFriendsStatuses: (statuses: FriendsStatusType[]) =>
        set(
          produce((state: statusStateType) => {
            state.friendsStatuses = statuses;
          }),
        ),
      changeCurrentStatus: (userId: string | null, isMe: boolean = false) =>
        set(
          produce((state: statusStateType) => {
            if (!userId) {
              state.currentStatus = null;
              return;
            }
            const statuses = isMe
              ? state.userStatuses
              : state.friendsStatuses.filter(
                  (status) => status.userId._id === userId,
                );

            if (statuses.length <= 0) {
              state.currentStatus = null;
              return;
            }

            let currentIndex = 0;
            if (!isMe) {
              for (let i = 0; i < statuses.length; i++) {
                if ((statuses[i] as any).isSeen === true) {
                  currentIndex = (i + 1) % statuses.length;
                } else {
                  break;
                }
              }
            }
            state.currentStatus = {
              isMe,
              userId,
              count: statuses.length,
              currentIndex: currentIndex,
              statuses: statuses,
            };
            state.isPlaying = true;
            state.currentStatusTime = 0;
            state.currentStatusInterval =
              state.currentStatus.statuses[state.currentStatus.currentIndex]
                .mediaType === "video"
                ? 0
                : 5000;
          }),
        ),
      changeCurrentStatusTime: (time: number) =>
        set(
          produce((state: statusStateType) => {
            state.currentStatusTime = Math.floor(time);
          }),
        ),
      changeIsPlaying: (isPlaying: boolean) =>
        set(
          produce((state: statusStateType) => {
            state.isPlaying = isPlaying;
          }),
        ),
      changeIsMuted: (isMuted: boolean) =>
        set(
          produce((state: statusStateType) => {
            state.isMuted = isMuted;
          }),
        ),
      resetStatus: () =>
        set(
          produce((state: statusStateType) => {
            state.currentStatus = null;
            state.currentStatusTime = 0;
            state.currentStatusInterval = 0;
            state.isPlaying = true;
            state.isMuted = false;
          }),
        ),
    }),
    //options
    {
      name: "Status",
    },
  ),
);
