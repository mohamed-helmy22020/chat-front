import { useChatStore } from "@/store/chatStore";
import { useUserStore } from "@/store/userStore";
import clsx from "clsx";
import Image from "next/image";
import { LuPhone, LuVideo } from "react-icons/lu";
import ConversationMenu from "./ConversationMenu";

const ConversationHeader = () => {
  const { participants, isTyping } = useChatStore(
    (state) => state.currentConversation!,
  );
  const userId = useUserStore((state) => state.user?._id);
  const { name, userProfileImage } = participants.find(
    (p) => p._id !== userId,
  )!;
  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-site-foreground p-4 dark:border-slate-700">
      <div className="flex items-center">
        <div className="relative flex min-h-9 min-w-9 items-center justify-center rounded-full border-2 border-white dark:border-slate-800">
          <Image
            className="rounded-full object-cover"
            src={userProfileImage || "/imgs/user.jpg"}
            alt="avatar"
            fill
          />
        </div>
        <div className="ml-3">
          <p className="font-medium">{name}</p>
          <p
            className={clsx(
              "text-xs text-slate-500 dark:text-slate-400",
              isTyping && "animate-pulse",
            )}
          >
            {isTyping ? "Typing..." : "Online"}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button className="cursor-pointer rounded-full p-2 hover:bg-gray-100 dark:hover:bg-slate-700">
          <LuPhone className="h-5 w-5 text-slate-500 dark:text-slate-400" />
        </button>
        <button className="cursor-pointer rounded-full p-2 hover:bg-gray-100 dark:hover:bg-slate-700">
          <LuVideo className="h-5 w-5 text-slate-500 dark:text-slate-400" />
        </button>
        <ConversationMenu />
      </div>
    </div>
  );
};

export default ConversationHeader;
