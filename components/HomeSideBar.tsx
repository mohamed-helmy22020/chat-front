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

import {
  getAllConversations,
  getBlockedList,
  getFriendsList,
  getFriendsRequests,
  getFriendsStatuses,
  getSentRequests,
  getUserStatuses,
} from "@/lib/actions/user.actions";
import { chatSocket } from "@/src/socket";
import { useChatStore } from "@/store/chatStore";
import { PageType, usePageStore } from "@/store/pageStore";
import { useStatusStore } from "@/store/statusStore";
import { useUserStore } from "@/store/userStore";
import { useEffect } from "react";
import { toast } from "sonner";
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
    addMessage,
    changeIsTyping,
    seeAllMessages,
  } = useChatStore(
    useShallow((state) => ({
      changeIsConnected: state.changeIsConnected,
      isConnected: state.isConnected,
      changeConversations: state.changeConversations,
      changeCurrentConversation: state.changeCurrentConversation,
      changeSearch: state.changeSearch,
      addMessage: state.addMessage,
      changeIsTyping: state.changeIsTyping,
      seeAllMessages: state.seeAllMessages,
    })),
  );
  const {
    friendsList,
    receivedRequests,
    sentRequests,
    setFriendsList,
    setReceivedRequestsList,
    setSentRequestsList,
    setBlockedList,
  } = useUserStore(
    useShallow((state) => ({
      friendsList: state.friendsList,
      blockedUser: state.blockedList,
      receivedRequests: state.receivedRequestsList,
      sentRequests: state.sentRequestsList,
      setFriendsList: state.setFriendsList,
      setBlockedList: state.setBlockedList,
      setReceivedRequestsList: state.setReceivedRequestsList,
      setSentRequestsList: state.setSentRequestsList,
    })),
  );
  const {
    changeUserStatuses,
    changeFriendsStatuses,
    addFriendStatus,
    deleteFriendStatus,
    userStausSeen,
  } = useStatusStore(
    useShallow((state) => ({
      changeUserStatuses: state.changeUserStatuses,
      changeFriendsStatuses: state.changeFriendsStatuses,
      currentStatus: state.currentStatus,
      addFriendStatus: state.addFriendStatus,
      deleteFriendStatus: state.deleteFriendStatus,
      userStausSeen: state.userStausSeen,
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
    const onErrors = (error: any) => {
      toast.error(error);
    };

    const onReceiveMessage = (res: ReceiveMessageType) => {
      if (res.success) {
        if (res.message.from !== user?._id) {
          addMessage(res.message, res.conversation);
        }
      } else {
        console.log("Error receiving message");
      }
    };

    const onMessagesSeen = () => {
      seeAllMessages();
    };

    const onTyping = (res: OnTypingRes) => {
      changeIsTyping(res.conversationId, res.isTyping);
    };

    const onFriendDeleted = (res: { userId: string }) => {
      setFriendsList(friendsList.filter((f) => f._id !== res.userId));
    };

    const onNewFriendRequest = (res: { user: RequestUserType }) => {
      setReceivedRequestsList([...receivedRequests, res.user]);
    };

    const onFriendAccepted = (res: { userId: string }) => {
      setFriendsList([
        ...friendsList,
        sentRequests.find((r) => r._id === res.userId)!,
      ]);
      setSentRequestsList(sentRequests.filter((r) => r._id !== res.userId));
    };

    const onFriendRequestCancelled = (res: { userId: string }) => {
      setSentRequestsList(sentRequests.filter((r) => r._id !== res.userId));
      setReceivedRequestsList(
        receivedRequests.filter((r) => r._id !== res.userId),
      );
    };
    const onNewFriendStatus = (res: { status: FriendsStatusType }) => {
      addFriendStatus(res.status);
    };
    const onDeleteFriendStatus = (res: { statusId: string }) => {
      deleteFriendStatus(res.statusId);
    };
    const onStatusSeen = (res: { statusId: string; user: MiniUserType }) => {
      userStausSeen(res.statusId, res.user);
    };
    chatSocket.on("receiveMessage", onReceiveMessage);
    chatSocket.on("messagesSeen", onMessagesSeen);
    chatSocket.on("typing", onTyping);
    chatSocket.on("friendDeleted", onFriendDeleted);
    chatSocket.on("newFriendRequest", onNewFriendRequest);
    chatSocket.on("friendAccepted", onFriendAccepted);
    chatSocket.on("friendRequestCancelled", onFriendRequestCancelled);
    chatSocket.on("newFriendStatus", onNewFriendStatus);
    chatSocket.on("deleteFriendStatus", onDeleteFriendStatus);
    chatSocket.on("statusSeen", onStatusSeen);
    chatSocket.on("errors", onErrors);
    chatSocket.on("connect", onConnect);
    chatSocket.on("disconnect", onDisconnect);

    return () => {
      chatSocket.off("receiveMessage", onReceiveMessage);
      chatSocket.off("messagesSeen", onMessagesSeen);

      chatSocket.off("typing", onTyping);
      chatSocket.off("friendDeleted", onFriendDeleted);
      chatSocket.off("newFriendRequest", onNewFriendRequest);
      chatSocket.off("friendAccepted", onFriendAccepted);
      chatSocket.off("friendRequestCancelled", onFriendRequestCancelled);
      chatSocket.off("newFriendStatus", onNewFriendStatus);
      chatSocket.off("deleteFriendStatus", onDeleteFriendStatus);
      chatSocket.off("statusSeen", onStatusSeen);

      chatSocket.off("errors", onErrors);
      chatSocket.off("connect", onConnect);
      chatSocket.off("disconnect", onDisconnect);
    };
  }, [
    changeIsConnected,
    changeIsTyping,
    friendsList,
    receivedRequests,
    sentRequests,
    setFriendsList,
    setReceivedRequestsList,
    setSentRequestsList,
    addFriendStatus,
    deleteFriendStatus,
    userStausSeen,
    addMessage,
    user,
    seeAllMessages,
  ]);

  useEffect(() => {
    const getData = async () => {
      try {
        const [
          getConversationsRes,
          getFriendsListRes,
          sentRequestsRes,
          friendsRequestsRes,
          getBlockedListRes,
          userStatusesRes,
          friendsStatusesRes,
        ] = await Promise.all([
          getAllConversations(),
          getFriendsList(),
          getSentRequests(),
          getFriendsRequests(),
          getBlockedList(),
          getUserStatuses(),
          getFriendsStatuses(),
        ]);

        // Update state with the results
        changeConversations(getConversationsRes.conversations);
        setFriendsList(getFriendsListRes.friends);
        setSentRequestsList(sentRequestsRes.sentRequests);
        setReceivedRequestsList(friendsRequestsRes.friendRequests);
        setBlockedList(getBlockedListRes.blockedUsers);
        changeUserStatuses(userStatusesRes.statuses);
        changeFriendsStatuses(friendsStatusesRes.statuses);
      } catch (e: any) {
        console.log("Error getting data", e);
      }
    };

    if (isConnected) {
      getData();
    }
  }, [
    isConnected,
    changeConversations,
    setFriendsList,
    setSentRequestsList,
    setReceivedRequestsList,
    setBlockedList,
    changeFriendsStatuses,
    changeUserStatuses,
  ]);

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
