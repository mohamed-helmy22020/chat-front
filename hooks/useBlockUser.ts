import { blockUser as blockUserAction } from "@/lib/actions/user.actions";
import { useUserStore } from "@/store/userStore";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

const useBlockUser = () => {
  const t = useTranslations("RequestUserCard.BlocksMenu");
  const { friendsList, blockedList, setFriendsList, setBlockedList } =
    useUserStore(
      useShallow((state) => ({
        friendsList: state.friendsList,
        blockedList: state.blockedList,
        setFriendsList: state.setFriendsList,
        setBlockedList: state.setBlockedList,
      })),
    );
  const blockUser = async (userId: string) => {
    const blockUserRes = blockUserAction(userId);

    toast.promise(blockUserRes, {
      loading: t("Blocking"),
      success: (data) => {
        setBlockedList([...blockedList, data.blockedUser]);
        if (friendsList.findIndex((f) => f._id === data.blockedUser._id) > -1) {
          setFriendsList(
            friendsList.filter((f) => f._id !== data.blockedUser._id),
          );
        }
        return {
          message: t("UserIsBlocked"),
          closeButton: true,
        };
      },
      error: "Error",
    });
  };
  return blockUser;
};
export default useBlockUser;
