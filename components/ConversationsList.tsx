import { useChatStore } from "@/store/chatStore";
import clsx from "clsx";
import { memo } from "react";
import { useShallow } from "zustand/react/shallow";
import ChatSearch from "./ChatSearch";
import ConversationItem from "./ConversationItem";
import NewConversation from "./NewConversation";
const ConversationItemMemo = memo(ConversationItem);

const ConversationsList = () => {
  const { conversations, currentConversation } = useChatStore(
    useShallow((state) => ({
      conversations: state.conversations,
      currentConversation: state.currentConversation,
    })),
  );
  const conversationsElements = [...conversations]
    .filter((m) => m.lastMessage !== null)
    .sort((a, b) => {
      return (
        new Date(b.lastMessage.createdAt).getTime() -
        new Date(a.lastMessage.createdAt).getTime()
      );
    })
    .map((c) => <ConversationItemMemo conversation={c} key={c.id} />);
  return (
    <div
      className={clsx(
        "flex max-h-screen w-full flex-col overflow-hidden border-e-2 border-site-foreground sm:flex sm:w-6/12 md:w-5/12 lg:w-4/12",
        currentConversation && "hidden",
        !currentConversation && "sm:w-full",
      )}
    >
      <div className="flex items-center justify-between p-5">
        <h1>Chats</h1>
        <div className="flex">
          <NewConversation />
        </div>
      </div>
      <ChatSearch />
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 py-2">
        {conversationsElements}
      </div>
    </div>
  );
};

export default ConversationsList;
