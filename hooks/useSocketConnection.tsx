import { convertErrors, showNotification } from "@/lib/utils";
import { chatSocket } from "@/src/socket";
import { useCallStore } from "@/store/callStore";
import { useChatStore } from "@/store/chatStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useStatusStore } from "@/store/statusStore";
import { useUserStore } from "@/store/userStore";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

const useSocketConnection = () => {
  const tError = useTranslations("Errors");
  const t = useTranslations("SocketConnection");
  const { user, changeFriendsOnlineStatus } = useUserStore(
    useShallow((state) => ({
      user: state.user,
      changeFriendsOnlineStatus: state.changeFriendsOnlineStatus,
    })),
  );
  const {
    changeIsConnected,
    addMessage,
    changeIsTyping,
    seeAllMessages,
    addReaction,
    deleteMessage,
    addGroupParticipant,
    removeGroupParticipant,
    updateGroupSettings,
  } = useChatStore(
    useShallow((state) => ({
      changeIsConnected: state.changeIsConnected,
      addMessage: state.addMessage,
      changeIsTyping: state.changeIsTyping,
      seeAllMessages: state.seeAllMessages,
      addReaction: state.addReaction,
      deleteMessage: state.deleteMessage,
      addGroupParticipant: state.addGroupParticipant,
      removeGroupParticipant: state.removeGroupParticipant,
      updateGroupSettings: state.updateGroupSettings,
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
  const { notifcationsSettings } = useSettingsStore(
    useShallow((state) => ({
      notifcationsSettings: state.notifcationsSettings,
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
      toast.error(tError(convertErrors(error)));
    };

    const onIncomingCall = (data: {
      from: MiniUserType;
      callId: string;
      callType: "voice" | "video";
    }) => {
      incomingCall(data.from, data.callId, data.callType);

      if (notifcationsSettings.messages === "Enable" && document.hidden) {
        showNotification(data.from.name as string, {
          body: t("IncomingCall"),
          icon: data.from.userProfileImage || "/imgs/user.jpg",
          tag: `Incoming-call${data.callId}`,
        });
      }
    };

    const onReceiveMessage = (res: ReceiveMessageType) => {
      if (res.success) {
        if (res.message.from._id !== user?._id) {
          addMessage(res.message, res.conversation);
          const audioElement =
            document.querySelector<HTMLAudioElement>(".message-sound");
          if (
            audioElement &&
            notifcationsSettings.incomingMessagesSound === "Enable"
          ) {
            audioElement.currentTime = 0;
            audioElement.play();
          }
          const otherSide = res.conversation.participants.find(
            (p: MiniUserType) => p._id !== user?._id,
          );
          if (notifcationsSettings.messages === "Enable" && document.hidden) {
            showNotification(
              notifcationsSettings.previews === "Enable"
                ? (otherSide?.name as string)
                : t("NewMessage"),
              {
                body:
                  notifcationsSettings.previews === "Enable"
                    ? res.message.text
                    : t("NewMessage"),
                icon:
                  (notifcationsSettings.previews === "Enable" &&
                    otherSide?.userProfileImage) ||
                  "/imgs/user.jpg",
                tag: `New-Message${res.message.id}`,
              },
            );
          }
        }
      } else {
        console.log("Error receiving message");
      }
    };

    const onMessageReaction = (data: {
      messageId: string;
      conversationId: string;
      react: ReactType;
    }) => {
      const otherSide = data.react.user;
      if (otherSide._id !== user?._id) {
        addReaction(
          data.messageId,
          data.conversationId,
          data.react.user._id,
          data.react,
        );
      }

      if (notifcationsSettings.messages === "Enable") {
        showNotification(
          notifcationsSettings.previews === "Enable"
            ? (otherSide.name as string)
            : t("NewReaction"),
          {
            body:
              notifcationsSettings.previews === "Enable"
                ? data.react.react
                : t("NewReaction"),
            icon:
              (notifcationsSettings.previews === "Enable" &&
                otherSide.userProfileImage) ||
              "/imgs/user.jpg",
            tag: `New-Reaction${data.messageId}`,
          },
        );
      }
    };

    const onMessagesSeen = () => {
      seeAllMessages();
    };

    const onMessageDeleted = (data: {
      messageId: string;
      conversationId: string;
    }) => {
      deleteMessage(data.messageId, data.conversationId);
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
          <span className="text-md font-extrabold">{res.user.name}</span>{" "}
          {t("SentFriendRequest")}
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
          {t("AcceptFriendRequest")}
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
    const onAddedToGroup = (res: {
      newUser: participant;
      group: ConversationType;
    }) => {
      addGroupParticipant(res.group, res.newUser);
    };

    const onDeletedFromGroup = (res: { groupId: string; userId: string }) => {
      removeGroupParticipant(res.groupId, res.userId);
    };

    const onGroupSettingsUpdated = (res: {
      groupId: string;
      groupSettings: GroupSettingsType;
    }) => {
      console.log("group settings updated");
      console.log({ res });
      updateGroupSettings(res.groupId, res.groupSettings);
    };

    chatSocket.on("receiveMessage", onReceiveMessage);
    chatSocket.on("groupSettingsUpdated", onGroupSettingsUpdated);
    chatSocket.on("addedToGroup", onAddedToGroup);
    chatSocket.on("deletedFromGroup", onDeletedFromGroup);
    chatSocket.on("messageReaction", onMessageReaction);
    chatSocket.on("messagesSeen", onMessagesSeen);
    chatSocket.on("messageDeleted", onMessageDeleted);
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
      chatSocket.off("groupSettingsUpdated", onGroupSettingsUpdated);
      chatSocket.off("addedToGroup", onAddedToGroup);
      chatSocket.off("deletedFromGroup", onDeletedFromGroup);
      chatSocket.off("messageReaction", onMessageReaction);
      chatSocket.off("messagesSeen", onMessagesSeen);
      chatSocket.off("messageDeleted", onMessageDeleted);
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
    addReaction,
    notifcationsSettings,
    t,
    deleteMessage,
    addGroupParticipant,
    tError,
    removeGroupParticipant,
    updateGroupSettings,
  ]);
};

export default useSocketConnection;
