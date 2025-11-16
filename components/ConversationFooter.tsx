import { chatSocket } from "@/src/socket";
import { useChatStore } from "@/store/chatStore";
import { useUserStore } from "@/store/userStore";
import { useState } from "react";
import { LuPaperclip, LuSend, LuSmile } from "react-icons/lu";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

const ConversationFooter = () => {
  const [message, setMessage] = useState<string>("");
  const user = useUserStore((state) => state.user);
  const currentConversation = useChatStore(
    (state) => state.currentConversation,
  );
  const otherSide = currentConversation?.participants.find(
    (p) => p._id !== user?._id,
  );
  const to = otherSide?._id as string;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.shiftKey) return;
      e.preventDefault();
      sendMessage();
    }
  };
  const sendMessage = () => {
    if (message.trim() === "") return;
    chatSocket.emit("sendPrivateMessage", to, message.trim());
    setMessage("");
  };
  return (
    <div className="border-t border-slate-200 bg-site-foreground p-3 dark:border-slate-700">
      <div className="flex items-center">
        <button className="cursor-pointer rounded-full p-2 hover:bg-gray-100 dark:hover:bg-slate-700">
          <LuPaperclip className="h-5 w-5 text-slate-500 dark:text-slate-400" />
        </button>
        <button className="cursor-pointer rounded-full p-2 hover:bg-gray-100 dark:hover:bg-slate-700">
          <LuSmile className="h-5 w-5 text-slate-500 dark:text-slate-400" />
        </button>

        <Textarea
          className="no-scrollbar mx-2 max-h-[80px] min-h-6 flex-1 resize-none bg-site-background px-4 py-2 focus:outline-none focus-visible:ring-0"
          placeholder="Type a message..."
          name="message"
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          value={message}
        />
        <Button
          className="cursor-pointer rounded-full bg-mainColor-600 p-2 text-white hover:bg-mainColor-700"
          onClick={sendMessage}
        >
          <LuSend className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ConversationFooter;
