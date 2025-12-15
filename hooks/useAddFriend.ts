import { sendFriendRequest } from "@/lib/actions/user.actions";
import { convertErrors } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

const useAddFriend = () => {
  const tError = useTranslations("Errors");
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { sentRequestsList, setSentRequestsList } = useUserStore(
    useShallow((state) => ({
      setSentRequestsList: state.setSentRequestsList,
      sentRequestsList: state.sentRequestsList,
    })),
  );

  const addFriend = async (userId: string) => {
    setIsSending(true);
    try {
      const sendFriendRequestRes = await sendFriendRequest(userId);
      if (sendFriendRequestRes.success) {
        setIsSent(true);
        setSentRequestsList([...sentRequestsList, sendFriendRequestRes.user]);
      } else {
        throw new Error(sendFriendRequestRes.msg);
      }
    } catch (error: any) {
      toast.error(tError(convertErrors(error.message)));
    } finally {
      setIsSending(false);
    }
  };
  return { addFriend, isSent, isSending };
};

export default useAddFriend;
