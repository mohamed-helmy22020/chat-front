import {
  acceptFriendRequest,
  cancelFriendRequest,
} from "@/lib/actions/user.actions";
import { useUserStore } from "@/store/userStore";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";

const useHandleFriendRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const {
    friendsList,
    setFriendsList,
    receivedRequestsList,
    setReceivedRequestsList,
  } = useUserStore(
    useShallow((state) => ({
      receivedRequestsList: state.receivedRequestsList,
      friendsList: state.friendsList,
      setReceivedRequestsList: state.setReceivedRequestsList,
      setFriendsList: state.setFriendsList,
    })),
  );
  const handleFriendRequest = async (
    userId: string,
    actionType: "accept-request" | "cancel-request",
  ) => {
    setIsLoading(true);
    try {
      if (actionType === "accept-request") {
        await acceptFriendRequest(userId);
        setFriendsList([
          ...friendsList,
          receivedRequestsList.find((r) => r._id === userId)!,
        ]);
        setReceivedRequestsList(
          receivedRequestsList.filter((r) => r._id !== userId),
        );
      } else {
        await cancelFriendRequest(userId);
        setReceivedRequestsList(
          receivedRequestsList.filter((r) => r._id !== userId),
        );
      }
      setIsDone(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return { handleFriendRequest, isLoading, isDone };
};
export default useHandleFriendRequest;
