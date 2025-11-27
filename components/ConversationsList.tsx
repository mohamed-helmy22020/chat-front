import { useChatStore } from "@/store/chatStore";
import { memo } from "react";
import ChatSearch from "./ChatSearch";
import ConversationItem from "./ConversationItem";
import NewConversation from "./NewConversation";
const ConversationItemMemo = memo(ConversationItem);

const ConversationsList = () => {
  const conversations = useChatStore((state) => state.conversations);
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
    <div className="flex max-h-screen w-4/12 flex-col overflow-hidden border-e-2 border-site-foreground">
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
