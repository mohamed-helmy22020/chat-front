import { getUserConversation } from "@/lib/actions/user.actions";
import { useChatStore } from "@/store/chatStore";
import { usePageStore } from "@/store/pageStore";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

const useChatWith = (type: "id" | "email" = "id") => {
  const t = useTranslations("RequestUserCard.FriendsMenu");
  const setPage = usePageStore((state) => state.setPage);
  const { changeCurrentConversation, conversations } = useChatStore(
    useShallow((state) => ({
      changeCurrentConversation: state.changeCurrentConversation,
      conversations: state.conversations,
    })),
  );
  const chatWith = async (user: string) => {
    if (type === "id") {
      const existConversation = conversations.find(
        (c) => c.participants.findIndex((p) => p._id === user) > -1,
      );
      if (existConversation) {
        changeCurrentConversation(existConversation);
        setPage("chat");
        return;
      }
    }
    try {
      const toastId = toast.loading(t("LoadingConversation"));
      const getUserConversationRes = await getUserConversation(user, type);
      toast.dismiss(toastId);
      if (getUserConversationRes.success) {
        changeCurrentConversation(getUserConversationRes.conversation);
        setPage("chat");
      } else {
        throw new Error(t("ErrorGettingConversation"));
      }
    } catch (error) {
      console.log(error);
      toast.error(t("ErrorGettingConversation"));
    }
  };
  return chatWith;
};
export default useChatWith;
