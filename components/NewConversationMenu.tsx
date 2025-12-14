import useChatWith from "@/hooks/useChatWith";
import { useChatStore } from "@/store/chatStore";
import { useUserStore } from "@/store/userStore";
import clsx from "clsx";
import { Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { getLangDir } from "rtl-detect";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import ChatSearch from "./ChatSearch";
import RequestUserCard from "./RequestUserCard";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type Props = {
  setIsNewConversationOpen: (value: boolean) => void;
};

const EmailZod = z.string().email();
const NewConversationMenu = ({ setIsNewConversationOpen }: Props) => {
  const t = useTranslations("Chat.NewConversationMenu");
  const locale = useLocale();
  const dir = getLangDir(locale);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [search, setSearch] = useState("");
  const [email, setEmail] = useState("");
  const chatWit = useChatWith("email");
  const { currentConversation } = useChatStore(
    useShallow((state) => ({
      currentConversation: state.currentConversation,
    })),
  );
  const friendsList = useUserStore((state) => state.friendsList);

  const friendsListElements = friendsList
    .filter((friend) => friend.name.includes(search))
    .map((friend) => (
      <RequestUserCard key={friend._id} user={friend} type="newChat" />
    ));
  const chatWithEmail = async () => {
    if (!EmailZod.safeParse(email).success) return;
    setIsLoadingChat(true);
    await chatWit(email);
    setIsLoadingChat(false);
  };
  return (
    <div
      className={clsx(
        "flex max-h-svh w-full flex-col overflow-hidden border-e-2 border-site-foreground sm:flex sm:w-6/12 md:w-5/12 lg:w-4/12",
        currentConversation && "hidden",
        !currentConversation && "sm:w-full",
      )}
    >
      <div className="flex items-center p-5 select-none">
        <button
          onClick={() => setIsNewConversationOpen(false)}
          className="cursor-pointer pe-2"
        >
          {dir === "ltr" ? (
            <FaArrowLeft className="transition hover:-translate-x-1" />
          ) : (
            <FaArrowRight className="transition hover:translate-x-1" />
          )}
        </button>
        <p>{t("NewChat")}</p>
      </div>
      <ChatSearch search={search} setSearch={setSearch} />
      <div className="overflow-auto px-3">
        <div className="mb-3 flex flex-col gap-1 px-2">
          <p className="mb-3 text-gray-400 dark:text-gray-500">
            {t("ChatWithEmail")}
          </p>
          <div className="flex">
            <Input
              className="rounded-s-sm rounded-e-none focus-visible:ring-0"
              placeholder={t("EnterUserEmail")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
            <Button
              variant="default"
              className="rounded-s-none bg-mainColor-500 text-white hover:bg-mainColor-700"
              onClick={chatWithEmail}
              disabled={isLoadingChat}
            >
              {isLoadingChat ? <Loader2 className="animate-spin" /> : t("Chat")}
            </Button>
          </div>
        </div>
        <p className="px-2 text-gray-400 dark:text-gray-500">
          {t("FriendsList")}
        </p>
        {friendsListElements}
      </div>
    </div>
  );
};

export default NewConversationMenu;
