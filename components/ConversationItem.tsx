import { formatDateToStatus } from "@/lib/utils";
import { useChatStore } from "@/store/chatStore";
import { useUserStore } from "@/store/userStore";
import clsx from "clsx";
import { motion } from "motion/react";
import Image from "next/image";
import { FaImage, FaVideo } from "react-icons/fa";
import { useShallow } from "zustand/react/shallow";
import { Button } from "./ui/button";
type Props = {
  conversation: ConversationType;
};
const ConversationItem = ({ conversation }: Props) => {
  const { lastMessage, participants } = conversation;
  const userId = useUserStore((state) => state.user?._id);
  const otherSide = participants.find((p) => p._id !== userId);
  const { changeCurrentConversation, changeLastMessage, currentCOnversation } =
    useChatStore(
      useShallow((state) => ({
        changeCurrentConversation: state.changeCurrentConversation,
        changeLastMessage: state.changeLastMessage,
        currentCOnversation: state.currentConversation,
      })),
    );
  const chooseChat = () => {
    changeCurrentConversation(conversation);
    changeLastMessage(conversation, {
      ...conversation.lastMessage,
      conversationId: conversation.id,
      seen: true,
    });
  };
  const content =
    lastMessage.mediaType === "image" ? (
      <>
        <FaImage /> {lastMessage.text || "Image"}
      </>
    ) : lastMessage.mediaType === "video" ? (
      <>
        <FaVideo />

        {lastMessage.text || "Video"}
      </>
    ) : (
      lastMessage.text
    );
  return (
    <motion.div
      className={clsx(
        "rounded-sm select-none hover:bg-site-foreground dark:hover:bg-gray-800",
        currentCOnversation?.id === conversation.id &&
          "bg-site-foreground dark:bg-gray-800",
      )}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Button
        className="flex h-full w-full cursor-pointer justify-start gap-3 rounded-sm px-2 py-3"
        variant="ghostFull"
        onClick={chooseChat}
      >
        <div className="relative flex min-h-9 min-w-9 items-center justify-center rounded-full">
          <Image
            className="rounded-full object-cover"
            src={otherSide?.userProfileImage || "/imgs/user.jpg"}
            alt="avatar"
            fill
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col items-start justify-center">
          <div className="flex w-full items-center justify-between">
            <h2 className="text-sm capitalize">{otherSide?.name}</h2>
            <p className="line-clamp-1 text-xs text-gray-500">
              {formatDateToStatus(lastMessage.createdAt)}
            </p>
          </div>
          <div
            className={clsx(
              "flex max-w-full items-center gap-1 truncate font-light text-slate-400",
              lastMessage.from !== userId && !lastMessage.seen && "text-white",
              conversation.isTyping && "animate-pulse",
            )}
          >
            {conversation.isTyping ? "Typing..." : content}
          </div>
        </div>
      </Button>
    </motion.div>
  );
};

export default ConversationItem;
