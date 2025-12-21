import { useChatStore } from "@/store/chatStore";
import Image from "next/image";
import { useShallow } from "zustand/react/shallow";
import ConversationGroupMenu from "./ConversationGroupMenu";

const ConversationGroupHeader = () => {
  const { currentConversation: group } = useChatStore(
    useShallow((state) => ({
      currentConversation: state.currentConversation,
    })),
  );
  if (!group || group.type !== "group") {
    return null;
  }
  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-site-foreground p-4 dark:border-slate-700">
      <div className="flex items-center">
        <div className="relative flex min-h-9 min-w-9 items-center justify-center rounded-full border-2 border-white dark:border-slate-800">
          <Image
            className="rounded-full object-cover"
            src={group?.groupImage || "/imgs/group.png"}
            alt="avatar"
            fill
          />
        </div>
        <div className="ml-3">
          <p className="font-medium">{group?.groupName}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <ConversationGroupMenu />
      </div>
    </div>
  );
};

export default ConversationGroupHeader;
