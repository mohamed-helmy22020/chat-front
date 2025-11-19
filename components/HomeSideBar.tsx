"use client";
import { cn } from "@/lib/utils";
import {
  LuCircleDotDashed,
  LuMessageSquareText,
  LuSettings,
  LuUser,
  LuUserRoundX,
  LuUsers,
} from "react-icons/lu";

import { getAllConversations } from "@/lib/actions/user.actions";
import { chatSocket } from "@/src/socket";
import { useChatStore } from "@/store/chatStore";
import { PageType, usePageStore } from "@/store/pageStore";
import { useUserStore } from "@/store/userStore";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { Separator } from "./ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
type Props = {
  userProp?: UserType;
};
const HomeSideBar = ({ userProp }: Props) => {
  const { user, changeUserData } = useUserStore(
    useShallow((state) => ({
      changeUserData: state.changeUserData,
      user: state.user,
    })),
  );
  useEffect(() => {
    if (userProp) {
      changeUserData(userProp);
    }
  }, [userProp, changeUserData]);

  const {
    changeIsConnected,
    changeConversations,
    isConnected,
    changeLastMessage,
    addMessage,
    changeIsTyping,
  } = useChatStore(
    useShallow((state) => ({
      changeIsConnected: state.changeIsConnected,
      isConnected: state.isConnected,
      changeConversations: state.changeConversations,
      changeCurrentConversation: state.changeCurrentConversation,
      changeSearch: state.changeSearch,
      changeLastMessage: state.changeLastMessage,
      addMessage: state.addMessage,
      changeIsTyping: state.changeIsTyping,
    })),
  );

  useEffect(() => {
    if (chatSocket.connected) {
      changeIsConnected(true);
    }
    const onConnect = () => {
      console.log("chat connected");
      changeIsConnected(true);
    };
    const onDisconnect = () => {
      console.log("chat disconnect");
      changeIsConnected(false);
    };
    const onReceiveMessage = (res: ReceiveMessageType) => {
      if (res.success) {
        changeLastMessage(res.conversation, res.message);
        addMessage(res.message, res.conversation);
      } else {
        console.log("Error receiving message");
      }
    };

    const onTyping = (res: OnTypingRes) => {
      changeIsTyping(res.conversationId, res.isTyping);
    };

    chatSocket.on("receiveMessage", onReceiveMessage);
    chatSocket.on("typing", onTyping);
    chatSocket.on("connect", onConnect);
    chatSocket.on("disconnect", onDisconnect);

    return () => {
      chatSocket.off("receiveMessage", onReceiveMessage);
      chatSocket.off("typing", onTyping);
      chatSocket.off("connect", onConnect);
      chatSocket.off("disconnect", onDisconnect);
    };
  }, [
    changeIsConnected,
    changeConversations,
    user,
    changeLastMessage,
    addMessage,
    changeIsTyping,
  ]);

  useEffect(() => {
    const getData = async () => {
      try {
        const getConversationsRes = await getAllConversations();
        changeConversations(getConversationsRes.conversations);
      } catch (e: any) {
        console.log("Error getting conversations", e);
      }
    };

    if (isConnected) {
      getData();
    }
  }, [isConnected, changeConversations]);

  useEffect(() => {
    if (user?.accessToken) {
      chatSocket.io.opts.extraHeaders = {
        Authorization: `Bearer ${user?.accessToken}`,
      };
      chatSocket.connect();
    }
  }, [user]);

  return (
    <div className="flex flex-col overflow-hidden bg-site-foreground px-2 py-3.5">
      <div className="flex flex-col items-center justify-center">
        <SideBarButton Icon={LuMessageSquareText} page="chat" />
        <SideBarButton Icon={LuCircleDotDashed} page="status" />
        <SideBarButton Icon={LuUsers} page="friends" />
        <SideBarButton Icon={LuUserRoundX} page="blocks" />
      </div>
      <div className="flex-1">
        <Separator />
      </div>
      <div className="flex flex-col">
        <SideBarButton Icon={LuSettings} page="settings" />
        <SideBarButton Icon={LuUser} page="profile" />
      </div>
    </div>
  );
};

const SideBarButton = ({
  Icon,
  page,
}: {
  Icon: React.ComponentType<{ size?: number }>;
  page: PageType;
}) => {
  const { currentPage, setPage } = usePageStore(
    useShallow((state) => ({
      currentPage: state.page,
      setPage: state.setPage,
    })),
  );
  const isActive = page === currentPage;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className={cn(
            "mb-2 cursor-pointer rounded-full p-2 text-gray-400 hover:bg-site-background",
            {
              "text-white": isActive,
              "bg-site-background": isActive,
            },
          )}
          onClick={() => setPage(page)}
        >
          <Icon size={24} />
        </button>
      </TooltipTrigger>
      <TooltipContent className="rounded-full" side="left" sideOffset={5}>
        <p className="capitalize select-none">{page}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default HomeSideBar;
