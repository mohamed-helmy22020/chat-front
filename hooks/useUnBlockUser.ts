import { unblockUser as unblockUserAction } from "@/lib/actions/user.actions";
import { useUserStore } from "@/store/userStore";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";

const useUnBlockUser = () => {
  const [isUnblocking, setIsUnblocking] = useState(false);
  const [isUnblocked, setIsUnblocked] = useState(false);
  const { blockedList, setBlockedList } = useUserStore(
    useShallow((state) => ({
      friendsList: state.friendsList,
      blockedList: state.blockedList,
      setFriendsList: state.setFriendsList,
      setBlockedList: state.setBlockedList,
    })),
  );
  const unblockUser = async (userId: string) => {
    setIsUnblocking(true);
    try {
      await unblockUserAction(userId);
      setIsUnblocked(true);
      setBlockedList(blockedList.filter((b) => b._id !== userId));
    } catch (error) {
      console.log(error);
    } finally {
      setIsUnblocking(false);
    }
  };
  return { unblockUser, isUnblocked, isUnblocking };
};
export default useUnBlockUser;
