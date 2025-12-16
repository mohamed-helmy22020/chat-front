import { forwardMessage as forwardMessageAction } from "@/lib/actions/user.actions";
import { convertErrors } from "@/lib/utils";
import { useChatStore } from "@/store/chatStore";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

const useForwardMessage = () => {
  const tError = useTranslations("Errors");
  const t = useTranslations("RequestUserCard.ForwardMenu");
  const {
    forwardedMessage,
    changeForwardMessage,
    addMessage,
    changeCurrentConversation,
  } = useChatStore(
    useShallow((state) => ({
      forwardedMessage: state.forwardMessage,
      changeForwardMessage: state.changeForwardMessage,
      addMessage: state.addMessage,
      changeCurrentConversation: state.changeCurrentConversation,
    })),
  );

  const forwardMessage = async (to: string) => {
    if (!forwardedMessage || !to) return;

    const toastId = toast.loading(t("ForwardingMessage"));

    const forwardMessageRes = await forwardMessageAction(
      forwardedMessage.id,
      to,
    );

    toast.dismiss(toastId);

    if (!forwardMessageRes.success) {
      return toast.error(tError(convertErrors(forwardMessageRes.msg)));
    }

    toast.success(t("MessageForwardedSuccess"));
    addMessage(forwardMessageRes.message, forwardMessageRes.conversation);
    changeForwardMessage(null);
    changeCurrentConversation(forwardMessageRes.conversation);
  };

  return { forwardMessage };
};

export default useForwardMessage;
