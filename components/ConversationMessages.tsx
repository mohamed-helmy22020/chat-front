import { getConversationMessages } from "@/lib/actions/user.actions";
import { useChatStore } from "@/store/chatStore";
import { useUserStore } from "@/store/userStore";
import { Loader2 } from "lucide-react";
import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useShallow } from "zustand/react/shallow";
import ConversationMessage from "./ConversationMessage";
const ConversationMessageMemo = memo(ConversationMessage);

const ConversationMessages = () => {
  const user = useUserStore((state) => state.user);
  const scrollableDiv = useRef<HTMLDivElement>(null);
  const [isGettingMessages, setIsGettingMessages] = useState(false);
  const wasAtBottomRef = useRef<boolean | undefined>(true);
  const [hasMore, setHasMore] = useState(false);

  const {
    currentConversationMessages,
    changeCurrentConversationMessages,
    currentConversation,
    addMoreMessages,
  } = useChatStore(
    useShallow((state) => ({
      currentConversationMessages: state.currentConversationMessages,
      changeCurrentConversationMessages:
        state.changeCurrentConversationMessages,
      currentConversation: state.currentConversation,
      addMoreMessages: state.addMoreMessages,
    })),
  );
  const otherSide = currentConversation?.participants.find(
    (p) => p._id !== user?._id,
  );

  const getMessages = useCallback(
    async (before?: string, limit?: number) => {
      setIsGettingMessages(true);

      try {
        const getMessagesRes = await getConversationMessages(
          otherSide!._id,
          before,
          limit,
        );
        setIsGettingMessages(false);
        if (getMessagesRes.success) {
          setHasMore(getMessagesRes.hasMore);
          console.log(getMessagesRes);
          return getMessagesRes.messages;
        } else {
          throw new Error("Error getting messages");
        }
      } catch (e: any) {
        console.log("Error getting messages", e);
      }
      return [];
    },
    [otherSide],
  );

  useEffect(() => {
    changeCurrentConversationMessages([]);
    (async () => {
      const messages = await getMessages();
      changeCurrentConversationMessages(messages);
    })();
  }, [getMessages, changeCurrentConversationMessages]);

  const isAtBottom = () => {
    const scrollable = scrollableDiv.current;
    if (!scrollable) return false;

    return (
      scrollable.scrollHeight - scrollable.scrollTop <=
      scrollable.clientHeight + 3
    );
  };

  useEffect(() => {
    const container = scrollableDiv.current;

    if (!container) return;

    const handleScroll = () => {
      wasAtBottomRef.current = isAtBottom();
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [otherSide]);

  useEffect(() => {
    const container = scrollableDiv.current;

    if (!container) return;

    const handleScroll = () => {
      const oldScrollHeight = container.scrollHeight;
      const oldScrollTop = container.scrollTop;
      if (container.scrollTop <= 25 && hasMore && !isGettingMessages) {
        console.log("at the top");

        (async () => {
          const messages = await getMessages(
            currentConversationMessages[0].createdAt,
          );
          addMoreMessages(messages);
          setTimeout(() => {
            const container = scrollableDiv.current;
            if (!container) return;

            const newScrollHeight = container.scrollHeight;
            const newScrollTop =
              newScrollHeight - oldScrollHeight + oldScrollTop;

            container.scrollTop = newScrollTop - 20;
          }, 0);
        })();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [
    otherSide,
    isGettingMessages,
    hasMore,
    addMoreMessages,
    getMessages,
    currentConversationMessages,
  ]);

  useEffect(() => {
    if (wasAtBottomRef.current) {
      scrollableDiv.current?.scrollTo(0, scrollableDiv.current?.scrollHeight);
    }
  }, [currentConversationMessages]);

  const messagesElements = currentConversationMessages.map((message, index) => (
    <ConversationMessageMemo
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
  }, [otherSide]);

  return (
    <>
      <div
        className="flex flex-1 flex-col overflow-y-auto bg-site-background p-4"
        ref={scrollableDiv}
      >
        {isGettingMessages && (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="scale-50 animate-spin" />
          </div>
        )}
        <div className="mt-auto space-y-3">{messagesElements}</div>
      </div>
    </>
  );
};

export default ConversationMessages;
