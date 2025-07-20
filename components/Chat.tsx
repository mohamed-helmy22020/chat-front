import Conversation from "./Conversation";
import ConversationsList from "./ConversationsList";

const Chat = () => {
  return (
    <div className="flex flex-1 overflow-hidden">
      <ConversationsList />
      <Conversation />
    </div>
  );
};

export default Chat;
