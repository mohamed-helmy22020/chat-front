import { useChatStore } from "@/store/chatStore";
import ChatSearch from "./ChatSearch";
import ConversationItem from "./ConversationItem";
import NewConversation from "./NewConversation";

const ConversationsList = () => {
  const conversations = useChatStore((state) => state.conversations);
  const conversationsElements = [...conversations]
    .sort((a, b) => {
      return (
        new Date(b.lastMessage.createdAt).getTime() -
        new Date(a.lastMessage.createdAt).getTime()
      );
    })
    .map((c) => <ConversationItem conversation={c} key={c.id} />);
  return (
    <div className="flex max-h-screen w-4/12 flex-col overflow-hidden border-e-2 border-site-foreground">
      <div className="flex items-center justify-between p-5">
        <h1>Chats</h1>
        <div className="flex">
          <NewConversation />
        </div>
      </div>
      <ChatSearch />
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {conversationsElements}
      </div>
    </div>
  );
};

export default ConversationsList;
