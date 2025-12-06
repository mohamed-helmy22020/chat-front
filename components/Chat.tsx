"use client";
import { useCallStore } from "@/store/callStore";
import { useChatStore } from "@/store/chatStore";
import { useShallow } from "zustand/react/shallow";
import Call from "./Call";
import Conversation from "./Conversation";
import ConversationsList from "./ConversationsList";

const Chat = () => {
  const { isCalling, isIncomingCall } = useCallStore(
    useShallow((state) => ({
      isCalling: state.isCalling,
      isIncomingCall: state.isIncomingCall,
    })),
  );
  const currentConversation = useChatStore(
    (state) => state.currentConversation,
  );
  return (
    <>
      {(isCalling || isIncomingCall) && <Call />}
      <div className="flex flex-1 overflow-hidden">
        <ConversationsList />
        {currentConversation ? (
          <Conversation />
        ) : (
          <div className="hidden"></div>
        )}
      </div>
    </>
  );
};

export default Chat;
