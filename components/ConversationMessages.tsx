import { getConversationMessages } from "@/lib/actions/user.actions";
import { useChatStore } from "@/store/chatStore";
import { useUserStore } from "@/store/userStore";
import { Loader2 } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import ConversationMessage from "./ConversationMessage";

const ConversationMessages = () => {
  const user = useUserStore((state) => state.user);
  const scrollableDiv = useRef<HTMLDivElement>(null);
  const [isGettingMessages, setIsGettingMessages] = useState(false);

  const {
    currentConversationMessages,
    changeCurrentConversationMessages,
    currentConversation,
  } = useChatStore(
    useShallow((state) => ({
      currentConversationMessages: state.currentConversationMessages,
      changeCurrentConversationMessages:
        state.changeCurrentConversationMessages,
      currentConversation: state.currentConversation,
    })),
  );
  const otherSide = currentConversation?.participants.find(
    (p) => p._id !== user?._id,
  );
  console.log({ currentConversationMessages, otherSide });

  useEffect(() => {
    const getMessages = async () => {
      setIsGettingMessages(true);
      try {
        console.log("tring");
        const getMessagesRes = await getConversationMessages(otherSide!._id);
        if (getMessagesRes.success) {
          changeCurrentConversationMessages(getMessagesRes.messages);
        } else {
          throw new Error("Error getting messages");
        }
      } catch (e: any) {
        console.log("Error getting messages", e);
      } finally {
        setIsGettingMessages(false);
      }
    };
    getMessages();
  }, [otherSide, changeCurrentConversationMessages]);

  const messagesElements = currentConversationMessages.map((message, index) => (
    <ConversationMessage
      key={message.id}
      isFirstMessage={
        index === 0 ||
        currentConversationMessages[index - 1].from !== message.from
      }
      isMine={message.from === user?._id}
      message={message}
      otherSide={otherSide!}
    />
  ));
  useLayoutEffect(() => {
    scrollableDiv.current?.scrollTo(0, scrollableDiv.current?.scrollHeight);
  }, [currentConversationMessages]);
  if (isGettingMessages) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }
  return (
    <div
      className="flex flex-1 flex-col overflow-y-auto bg-site-background p-4"
      ref={scrollableDiv}
    >
      <div className="mt-auto space-y-3">{messagesElements}</div>
    </div>
  );
};

export default ConversationMessages;
