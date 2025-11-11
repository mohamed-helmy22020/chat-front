import ConversationFooter from "./ConversationFooter";
import ConversationHeader from "./ConversationHeader";
import ConversationMessages from "./ConversationMessages";

const Conversation = () => {
  return (
    <div className="flex max-h-screen w-8/12 flex-col overflow-hidden">
      <ConversationHeader />
      <ConversationMessages />
      <ConversationFooter />
    </div>
  );
};

export default Conversation;
