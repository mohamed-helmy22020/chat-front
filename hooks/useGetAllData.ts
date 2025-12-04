import {
  getAllConversations,
  getBlockedList,
  getFriendsList,
  getFriendsRequests,
  getFriendsStatuses,
  getSentRequests,
  getUserStatuses,
} from "@/lib/actions/user.actions";
import { chatSocket } from "@/src/socket";
import { useChatStore } from "@/store/chatStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useStatusStore } from "@/store/statusStore";
import { useUserStore } from "@/store/userStore";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

const useGetAllData = () => {
  const user = useUserStore((state) => state.user);
  const { addLoadingProgress, changeIsLoadingData } = useSettingsStore(
    useShallow((state) => ({
      addLoadingProgress: state.addLoadingProgress,
      changeIsLoadingData: state.changeIsLoadingData,
    })),
  );
  const { changeConversations, isConnected } = useChatStore(
    useShallow((state) => ({
      isConnected: state.isConnected,
      changeConversations: state.changeConversations,
    })),
  );
  const {
    setFriendsList,
    setReceivedRequestsList,
    setSentRequestsList,
    setBlockedList,
  } = useUserStore(
    useShallow((state) => ({
      setFriendsList: state.setFriendsList,
      setBlockedList: state.setBlockedList,
      setReceivedRequestsList: state.setReceivedRequestsList,
      setSentRequestsList: state.setSentRequestsList,
    })),
  );
  const { changeUserStatuses, changeFriendsStatuses } = useStatusStore(
    useShallow((state) => ({
      changeUserStatuses: state.changeUserStatuses,
      changeFriendsStatuses: state.changeFriendsStatuses,
    })),
  );
  useEffect(() => {
    const getData = async () => {
      try {
        const [
          getConversationsRes,
          getFriendsListRes,
          sentRequestsRes,
          friendsRequestsRes,
          getBlockedListRes,
          userStatusesRes,
          friendsStatusesRes,
        ] = await Promise.all([
          getAllConversations().then((data) => {
            addLoadingProgress(100 / 7);
            return data;
          }),
          getFriendsList().then((data) => {
            addLoadingProgress(100 / 7);
            return data;
          }),
          getSentRequests().then((data) => {
            addLoadingProgress(100 / 7);
            return data;
          }),
          getFriendsRequests().then((data) => {
            addLoadingProgress(100 / 7);
            return data;
          }),
          getBlockedList().then((data) => {
            addLoadingProgress(100 / 7);
            return data;
          }),
          getUserStatuses().then((data) => {
            addLoadingProgress(100 / 7);
            return data;
          }),
          getFriendsStatuses().then((data) => {
            addLoadingProgress(100 / 7);
            return data;
          }),
        ]);

        // Update state with the results
        changeConversations(getConversationsRes.conversations);
        setFriendsList(getFriendsListRes.friends);
        setSentRequestsList(sentRequestsRes.sentRequests);
        setReceivedRequestsList(friendsRequestsRes.friendRequests);
        setBlockedList(getBlockedListRes.blockedUsers);
        changeUserStatuses(userStatusesRes.statuses);
        changeFriendsStatuses(friendsStatusesRes.statuses);
        changeIsLoadingData(false);
      } catch (e: any) {
        console.log("Error getting data", e);
      }
    };

    if (isConnected) {
      getData();
    }
  }, [
    isConnected,
    changeConversations,
    setFriendsList,
    setSentRequestsList,
    setReceivedRequestsList,
    setBlockedList,
    changeFriendsStatuses,
    changeUserStatuses,
    addLoadingProgress,
    changeIsLoadingData,
  ]);

  useEffect(() => {
    if (user?.accessToken) {
      chatSocket.io.opts.extraHeaders = {
        Authorization: `Bearer ${user?.accessToken}`,
        "ngrok-skip-browser-warning": "true",
      };
      chatSocket.connect();
    }
  }, [user]);
};
export default useGetAllData;
