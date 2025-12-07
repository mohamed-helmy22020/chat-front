import { chatSocket } from "@/src/socket";
import { useCallStore } from "@/store/callStore";
import { useChatStore } from "@/store/chatStore";
import { useStatusStore } from "@/store/statusStore";
import { useUserStore } from "@/store/userStore";
import { useEffect } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

const useSocketConnection = () => {
  const { user, changeFriendsOnlineStatus } = useUserStore(
    useShallow((state) => ({
      user: state.user,
      changeFriendsOnlineStatus: state.changeFriendsOnlineStatus,
    })),
  );
  const { changeIsConnected, addMessage, changeIsTyping, seeAllMessages } =
    useChatStore(
      useShallow((state) => ({
        changeIsConnected: state.changeIsConnected,
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
  } = useUserStore(
    useShallow((state) => ({
      friendsList: state.friendsList,
      receivedRequests: state.receivedRequestsList,
      sentRequests: state.sentRequestsList,
      setFriendsList: state.setFriendsList,
      setReceivedRequestsList: state.setReceivedRequestsList,
      setSentRequestsList: state.setSentRequestsList,
    })),
  );
  const { addFriendStatus, deleteFriendStatus, userStausSeen } = useStatusStore(
    useShallow((state) => ({
      addFriendStatus: state.addFriendStatus,
      deleteFriendStatus: state.deleteFriendStatus,
      userStausSeen: state.userStausSeen,
    })),
  );
  const { incomingCall } = useCallStore(
    useShallow((state) => ({
      incomingCall: state.incomingCall,
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

    const onIncomingCall = (data: {
      from: MiniUserType;
      callId: string;
      callType: "voice" | "video";
    }) => {
      incomingCall(data.from, data.callId, data.callType);
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
      toast.info(
        <div className="text-md">
          <span className="text-md font-extrabold">{res.user.name}</span> sent
          you a friend request
        </div>,
      );
    };

    const onFriendAccepted = (res: { userId: string }) => {
      const sentRequest = sentRequests.find((r) => r._id === res.userId)!;
      setFriendsList([...friendsList, sentRequest]);
      setSentRequestsList(sentRequests.filter((r) => r._id !== res.userId));
      toast.success(
        <div className="text-md">
          <span className="text-md font-extrabold">{sentRequest.name}</span>{" "}
          accept your friend request
        </div>,
      );
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
    const onFriendIsOnline = (res: { userId: string; isOnline: boolean }) => {
      changeFriendsOnlineStatus(res.userId, res.isOnline);
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
    chatSocket.on("friendIsOnline", onFriendIsOnline);
    chatSocket.on("incomingCall", onIncomingCall);
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
      chatSocket.off("friendIsOnline", onFriendIsOnline);
      chatSocket.off("incomingCall", onIncomingCall);
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
    changeFriendsOnlineStatus,
    incomingCall,
  ]);
};

export default useSocketConnection;
