import {
  forwardMessageToGroup,
  forwardMessageToPrivate,
} from "@/lib/actions/user.actions";
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

  const forwardMessage = async (
    to: string,
    type: "private" | "group" = "private",
  ) => {
    if (!forwardedMessage || !to) return;

    const toastId = toast.loading(t("ForwardingMessage"));
    let forwardMessageRes: any;
    if (type === "private") {
      forwardMessageRes = await forwardMessageToPrivate(
        forwardedMessage.id,
        to,
      );
    } else {
      forwardMessageRes = await forwardMessageToGroup(forwardedMessage.id, to);
    }

    toast.dismiss(toastId);

    if (!forwardMessageRes.success) {
      return toast.error(tError(convertErrors(forwardMessageRes.msg)));
    }
    console.log(forwardMessageRes);

    toast.success(t("MessageForwardedSuccess"));
    addMessage(forwardMessageRes.message, forwardMessageRes.conversation);
    changeForwardMessage(null);
    changeCurrentConversation(forwardMessageRes.conversation);
  };

  return { forwardMessage };
};

export default useForwardMessage;
