"use client";
import { useCallStore } from "@/store/callStore";
import { useChatStore } from "@/store/chatStore";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useShallow } from "zustand/react/shallow";
import Call from "./Call";
import Conversation from "./Conversation";
import ConversationsList from "./ConversationsList";
import PageAbout from "./PageAbout";

const Chat = () => {
  const t = useTranslations("Chat");
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
          <Conversation key={currentConversation.id} />
        ) : (
          <PageAbout
            title={t("Name")}
            about1={t("About1")}
            about2={t("About2")}
          >
            <Image
              src="/imgs/icon.png"
              width={100}
              height={100}
              alt="website icon"
            />
          </PageAbout>
        )}
      </div>
    </>
  );
};

export default Chat;
