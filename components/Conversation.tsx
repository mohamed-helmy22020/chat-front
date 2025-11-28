import { useChatStore } from "@/store/chatStore";
import ConversationFooter from "./ConversationFooter";
import ConversationHeader from "./ConversationHeader";
import ConversationMessages from "./ConversationMessages";
import ShowMessageMedia from "./ShowMessageMedia";

const Conversation = () => {
  const currentSelectedMediaMessage = useChatStore(
    (state) => state.currentSelectedMediaMessage,
  );
  return (
    <>
      {currentSelectedMediaMessage && <ShowMessageMedia />}
      <div className="relative flex max-h-screen w-8/12 flex-col overflow-hidden">
        <ConversationHeader />
        <ConversationMessages />
        <ConversationFooter />
      </div>
    </>
  );
};

export default Conversation;
