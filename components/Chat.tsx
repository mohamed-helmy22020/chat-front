"use client";
import { useCallStore } from "@/store/callStore";
import { useChatStore } from "@/store/chatStore";
import { motion } from "motion/react";
import Image from "next/image";
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
          <Conversation key={currentConversation.id} />
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 500 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "tween", duration: 0.1, ease: "easeOut" }}
            className="hidden flex-col items-center justify-center select-none md:flex md:w-7/12 lg:w-8/12"
          >
            <Image
              src="/imgs/icon.png"
              width={100}
              height={100}
              alt="website icon"
            />
            <p className="mt-2 text-center text-xl">Chat App</p>
            <p className="text-md mt-5 p-9 pt-0 text-center text-slate-400">
              Send and receive messages Seamlessly.
              <br />
              Select a conversation to start messaging.
            </p>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default Chat;
