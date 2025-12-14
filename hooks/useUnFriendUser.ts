import { deleteFriend } from "@/lib/actions/user.actions";
import { useUserStore } from "@/store/userStore";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

const useUnFriendUser = () => {
  const t = useTranslations("RequestUserCard.FriendsMenu");
  const { friendsList, setFriendsList } = useUserStore(
    useShallow((state) => ({
      friendsList: state.friendsList,
      setFriendsList: state.setFriendsList,
    })),
  );

  const unFriendUser = async (userId: string) => {
    const unfriendUserRes = deleteFriend(userId);

    toast.promise(unfriendUserRes, {
      loading: t("Deleting"),
      success: () => {
        setFriendsList(friendsList.filter((f) => f._id !== userId));
        return {
          message: t("UserIsNoLongerFriend"),
          closeButton: true,
        };
      },
      error: t("Error"),
    });
  };
  return unFriendUser;
};

export default useUnFriendUser;
