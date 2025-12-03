import { getUserConversation } from "@/lib/actions/user.actions";
import { useChatStore } from "@/store/chatStore";
import { usePageStore } from "@/store/pageStore";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

const useChatWith = () => {
  const setPage = usePageStore((state) => state.setPage);
  const { changeCurrentConversation, conversations } = useChatStore(
    useShallow((state) => ({
      changeCurrentConversation: state.changeCurrentConversation,
      conversations: state.conversations,
    })),
  );
  const chatWith = async (userId: string) => {
    const existConversation = conversations.find(
      (c) => c.participants.findIndex((p) => p._id === userId) > -1,
    );
    if (existConversation) {
      changeCurrentConversation(existConversation);
      setPage("chat");
      return;
    }
    try {
      const toastId = toast.loading("Loading conversation...");
      const getUserConversationRes = await getUserConversation(userId);
      toast.dismiss(toastId);
      if (getUserConversationRes.success) {
        changeCurrentConversation(getUserConversationRes.conversation);
        setPage("chat");
      } else {
        throw new Error("Error getting conversation");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error getting conversation");
    }
  };
  return chatWith;
};
export default useChatWith;
