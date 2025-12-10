import { useChatStore } from "@/store/chatStore";
import { motion } from "motion/react";
import ConversationFooter from "./ConversationFooter";
import ConversationHeader from "./ConversationHeader";
import ConversationMessages from "./ConversationMessages";
import ShowMessageMedia from "./ShowMessageMedia";

const Conversation = () => {
  const currentSelectedMediaMessage = useChatStore(
    (state) => state.currentSelectedMediaMessage,
  );
  return (
    <>
      {currentSelectedMediaMessage && <ShowMessageMedia />}
      <motion.div
        initial={{ opacity: 0, x: 500 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "tween", duration: 0.1, ease: "easeOut" }}
        className="relative flex max-h-svh w-full flex-col overflow-hidden sm:w-6/12 md:w-7/12 lg:w-8/12"
      >
        <ConversationHeader />
        <ConversationMessages />
        <ConversationFooter />
      </motion.div>
    </>
  );
};

export default Conversation;
