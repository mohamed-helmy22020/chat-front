"use client";
import { useChatStore } from "@/store/chatStore";
import Conversation from "./Conversation";
import ConversationsList from "./ConversationsList";

const Chat = () => {
  const currentConversation = useChatStore(
    (state) => state.currentConversation,
  );
  return (
    <div className="flex flex-1 overflow-hidden">
      <ConversationsList />
      {currentConversation ? <Conversation /> : <div className="hidden"></div>}
    </div>
  );
};

export default Chat;
