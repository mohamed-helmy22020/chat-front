import { useChatStore } from "@/store/chatStore";
import { useUserStore } from "@/store/userStore";
import { motion } from "motion/react";
import { useLocale } from "next-intl";
import { getLangDir } from "rtl-detect";
import { useShallow } from "zustand/react/shallow";
import ConversationFooter from "./ConversationFooter";
import ConversationGroupHeader from "./ConversationGroupHeader";
import ConversationHeader from "./ConversationHeader";
import ConversationMessages from "./ConversationMessages";
import ForwardMenu from "./ForwardMenu";
import InviteMenu from "./InviteMenu";
import ShowMessageMedia from "./ShowMessageMedia";

const Conversation = () => {
  const locale = useLocale();
  const dir = getLangDir(locale);
  const userId = useUserStore((state) => state.user?._id);
  const { currentSelectedMediaMessage, currentConversation } = useChatStore(
    useShallow((state) => ({
      currentSelectedMediaMessage: state.currentSelectedMediaMessage,
      currentConversation: state.currentConversation,
    })),
  );
  console.log(
    currentConversation?.participants,
    userId,
    currentConversation?.participants.find((p) => p._id === userId),
  );
  return (
    <>
      {currentSelectedMediaMessage && <ShowMessageMedia />}
      <ForwardMenu />
      <InviteMenu />
      <motion.div
        initial={
          dir === "ltr" ? { opacity: 0, x: 500 } : { opacity: 0, x: -500 }
        }
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "tween", duration: 0.1, ease: "easeOut" }}
        className="relative flex max-h-svh w-full flex-col overflow-hidden sm:w-6/12 md:w-7/12 lg:w-8/12"
      >
        {currentConversation?.type === "private" ? (
          <ConversationHeader />
        ) : (
          <ConversationGroupHeader />
        )}
        <ConversationMessages />
        {currentConversation?.participants.find((p) => p._id === userId) && (
          <ConversationFooter />
        )}
      </motion.div>
    </>
  );
};

export default Conversation;
