import { useChatStore } from "@/store/chatStore";
import { useUserStore } from "@/store/userStore";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { memo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import ChatSearch from "./ChatSearch";
import ConversationItem from "./ConversationItem";
import NewConversation from "./NewConversation";
import NewConversationMenu from "./NewConversationMenu";
const ConversationItemMemo = memo(ConversationItem);

const ConversationsList = () => {
  const t = useTranslations("Chat.ConversationsList");
  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false);
  const userId = useUserStore((state) => state.user?._id);
  const [search, setSearch] = useState("");
  const { conversations, currentConversation } = useChatStore(
    useShallow((state) => ({
      conversations: state.conversations,
      currentConversation: state.currentConversation,
    })),
  );

  if (isNewConversationOpen) {
    return (
      <NewConversationMenu
        setIsNewConversationOpen={setIsNewConversationOpen}
      />
    );
  }

  const conversationsElements = [...conversations]
    .filter((c) => {
      if (c.lastMessage === null) return false;
      const otherSide = c.participants.find((p) => p._id !== userId);
      if ((!otherSide && c.type !== "group") || !c.lastMessage.text)
        return false;
      return (
        otherSide?.name.toLowerCase().includes(search.toLowerCase()) ||
        c.lastMessage.text.includes(search.toLowerCase()) ||
        c.groupName.includes(search)
      );
    })
    .sort((a, b) => {
      return (
        new Date(b.lastMessage?.createdAt || b.updatedAt).getTime() -
        new Date(a.lastMessage?.createdAt || b.updatedAt).getTime()
      );
    })
    .map((c) => <ConversationItemMemo conversation={c} key={c.id} />);
  return (
    <div
      className={clsx(
        "flex max-h-svh w-full flex-col overflow-hidden border-e-2 border-site-foreground sm:flex sm:w-6/12 md:w-5/12 lg:w-4/12",
        currentConversation && "hidden",
        !currentConversation && "sm:w-full",
      )}
    >
      <div className="flex items-center justify-between p-5">
        <h1>{t("Title")}</h1>
        <div className="flex">
          <NewConversation
            setIsNewConversationOpen={setIsNewConversationOpen}
          />
        </div>
      </div>
      <ChatSearch search={search} setSearch={setSearch} />
      <div className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-2">
        {conversationsElements}
      </div>
    </div>
  );
};

export default ConversationsList;
