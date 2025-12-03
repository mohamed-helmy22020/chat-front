import { deleteFriend } from "@/lib/actions/user.actions";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

const useUnFriendUser = () => {
  const { friendsList, setFriendsList } = useUserStore(
    useShallow((state) => ({
      friendsList: state.friendsList,
      setFriendsList: state.setFriendsList,
    })),
  );

  const unFriendUser = async (userId: string) => {
    const unfriendUserRes = deleteFriend(userId);

    toast.promise(unfriendUserRes, {
      loading: "Deleting...",
      success: () => {
        setFriendsList(friendsList.filter((f) => f._id !== userId));
        return {
          message: `User is no longer a friend`,
          closeButton: true,
        };
      },
      error: "Error",
    });
  };
  return unFriendUser;
};

export default useUnFriendUser;
