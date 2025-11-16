import { formatDateToStatus } from "@/lib/utils";
import { useChatStore } from "@/store/chatStore";
import { useUserStore } from "@/store/userStore";
import clsx from "clsx";
import Image from "next/image";
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
  return (
    <div
      className={clsx(
        "rounded-sm select-none hover:bg-gray-800",
        currentCOnversation?.id === conversation.id && "bg-gray-800",
      )}
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
              "max-w-full truncate font-light text-slate-400",
              lastMessage.from !== userId && !lastMessage.seen && "text-white",
              conversation.isTyping && "animate-pulse",
            )}
          >
            {conversation.isTyping ? "Typing..." : lastMessage.text}
          </div>
        </div>
      </Button>
    </div>
  );
};

export default ConversationItem;
