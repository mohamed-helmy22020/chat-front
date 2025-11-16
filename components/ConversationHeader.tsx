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
  console.log({ isTyping });
  const userId = useUserStore((state) => state.user?._id);
  const { name, userProfileImage } = participants.find(
    (p) => p._id !== userId,
  )!;
  console.log({ participants });
  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-site-foreground p-4 dark:border-slate-700">
      <div className="flex items-center">
        <Image
          width={40}
          height={40}
          src={userProfileImage || "/imgs/user.jpg"}
          className="rounded-full border-2 border-white object-cover dark:border-slate-800"
          alt="user-1"
        />
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
