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
      <div className="relative flex max-h-screen w-full flex-col overflow-hidden sm:w-6/12 md:w-7/12 lg:w-8/12">
        <ConversationHeader />
        <ConversationMessages />
        <ConversationFooter />
      </div>
    </>
  );
};

export default Conversation;
