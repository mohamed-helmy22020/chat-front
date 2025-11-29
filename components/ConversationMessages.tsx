import { getConversationMessages } from "@/lib/actions/user.actions";
import { chatSocket } from "@/src/socket";
import { useChatStore } from "@/store/chatStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useUserStore } from "@/store/userStore";
import clsx from "clsx";
import { Loader2 } from "lucide-react";
import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useShallow } from "zustand/react/shallow";
import ConversationMessage from "./ConversationMessage";
import { Button } from "./ui/button";
const ConversationMessageMemo = memo(ConversationMessage);

const ConversationMessages = () => {
  const oldScrollHeight = useRef(0);
  const oldScrollTop = useRef(0);
  const user = useUserStore((state) => state.user);
  const [lastMessage, setLastMessage] = useState<MessageType | null>(null);
  const isFocus = useSettingsStore((state) => state.isFocus);

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
  const scrollableDiv = useRef<HTMLDivElement>(null);
  const [isGettingMessages, setIsGettingMessages] = useState(false);
  const wasAtBottomRef = useRef<boolean | undefined>(true);
  const [hasMore, setHasMore] = useState(false);
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const prevScrollHeightRef = useRef(0);
  const isPrependingRef = useRef(false);

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
      if (isAtBottom()) {
        const currentConversationLastMessage =
          currentConversationMessages[currentConversationMessages.length - 1];
        setNewMessagesCount(0);
        if (
          currentConversationLastMessage?.from !== user?._id &&
          !currentConversationLastMessage?.seen &&
          isFocus
        ) {
          chatSocket.emit("seeAllMessages", otherSide?._id);
        }
      }
      wasAtBottomRef.current = isAtBottom();
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [otherSide, isFocus, user, currentConversationMessages]);

  useLayoutEffect(() => {
    const currentConversationLastMessage =
      currentConversationMessages[currentConversationMessages.length - 1];
    if (
      wasAtBottomRef.current ||
      currentConversationLastMessage?.type === "pending"
    ) {
      scrollableDiv.current?.scrollTo(0, scrollableDiv.current?.scrollHeight);
      if (
        currentConversationLastMessage?.from !== user?._id &&
        !currentConversationLastMessage?.seen &&
        isFocus
      ) {
        chatSocket.emit("seeAllMessages", otherSide?._id);
      }
    } else if (
      currentConversationLastMessage?.from !== user?._id &&
      lastMessage?.id !== currentConversationLastMessage?.id
    ) {
      setLastMessage(currentConversationLastMessage);
      setNewMessagesCount((count) => count + 1);
    }
  }, [currentConversationMessages, user, lastMessage, otherSide, isFocus]);

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

    (async function () {
      const messages: MessageType[] = await getMessages();
      chatSocket.emit("seeAllMessages", otherSide?._id);
      changeCurrentConversationMessages(messages);
    })();
  }, [getMessages, changeCurrentConversationMessages, otherSide, user]);

  useEffect(() => {
    const container = scrollableDiv.current;

    if (!container) return;

    const handleScroll = () => {
      oldScrollHeight.current = container.scrollHeight;
      oldScrollTop.current = container.scrollTop;
      if (container.scrollTop <= 0 && hasMore && !isGettingMessages) {
        prevScrollHeightRef.current = container.scrollHeight;
        isPrependingRef.current = true;

        (async () => {
          const messages = await getMessages(
            currentConversationMessages[0].createdAt,
          );

          addMoreMessages(messages);
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

  useLayoutEffect(() => {
    if (isPrependingRef.current && scrollableDiv.current) {
      const container = scrollableDiv.current;

      const newScrollHeight = container.scrollHeight;
      const newScrollTop =
        newScrollHeight - oldScrollHeight.current + oldScrollTop.current;

      container.scrollTop = newScrollTop;

      isPrependingRef.current = false;
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

  return (
    <>
      {newMessagesCount > 0 && (
        <Button
          variant="ghostFull"
          className="absolute end-8 bottom-20 z-30 flex !h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-mainColor-600 !p-0"
          onClick={() => {
            scrollableDiv.current?.scrollTo(
              0,
              scrollableDiv.current?.scrollHeight,
            );
          }}
        >
          <IoIosArrowDown />
          <div className="absolute -end-2 -bottom-2 flex h-6 w-6 items-center justify-center rounded-full bg-site-foreground">
            {newMessagesCount}
          </div>
        </Button>
      )}
      <div
        className="relative flex flex-1 flex-col overflow-y-auto bg-site-background p-4"
        ref={scrollableDiv}
      >
        <div
          className={clsx(
            "flex flex-1 items-center justify-center",
            !isGettingMessages && "invisible",
          )}
        >
          <Loader2 className="scale-50 animate-spin" />
        </div>

        <div className="mt-auto space-y-3">{messagesElements}</div>
      </div>
    </>
  );
};

export default ConversationMessages;
