import { cancelFriendRequest as cancelSentRequestAction } from "@/lib/actions/user.actions";
import { useUserStore } from "@/store/userStore";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";

const useCancelSentRequest = () => {
  const [isCancelling, setIsCancelling] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const { sentRequestsList, setSentRequestsList } = useUserStore(
    useShallow((state) => ({
      sentRequestsList: state.sentRequestsList,
      setSentRequestsList: state.setSentRequestsList,
    })),
  );
  const cancelSentRequest = async (userId: string) => {
    setIsCancelling(true);
    try {
      await cancelSentRequestAction(userId);
      setIsCancelled(true);
      setSentRequestsList(sentRequestsList.filter((r) => r._id !== userId));
    } catch (error) {
      console.log(error);
    } finally {
      setIsCancelling(false);
    }
  };
  return { cancelSentRequest, isCancelled, isCancelling };
};
export default useCancelSentRequest;
