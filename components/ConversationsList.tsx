import ChatSearch from "./ChatSearch";
import ConversationItem from "./ConversationItem";
import NewConversation from "./NewConversation";

const ConversationsList = () => {
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
        <ConversationItem />
        <ConversationItem />
        <ConversationItem />
        <ConversationItem />
        <ConversationItem />
        <ConversationItem />
        <ConversationItem />
      </div>
    </div>
  );
};

export default ConversationsList;
