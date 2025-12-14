import { useCallStore } from "@/store/callStore";
import { useChatStore } from "@/store/chatStore";
import { useUserStore } from "@/store/userStore";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useCallback } from "react";
import { LuPhone, LuVideo } from "react-icons/lu";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import ConversationMenu from "./ConversationMenu";

const ConversationHeader = () => {
  const t = useTranslations("Chat.Conversation");
  const { call, isCalling, isInCall, isIncomingCall } = useCallStore(
    useShallow((state) => ({
      isCalling: state.isCalling,
      isInCall: state.isInCall,
      isIncomingCall: state.isIncomingCall,
      call: state.call,
    })),
  );
  const { participants, isTyping } = useChatStore(
    (state) => state.currentConversation!,
  );
  const userId = useUserStore((state) => state.user?._id);
  const { name, userProfileImage, _id } = participants.find(
    (p) => p._id !== userId,
  )!;
  const isOtherUserOnline = useUserStore((state) => state.friendsList).find(
    (f) => f._id === _id,
  )?.isOnline;
  const canCall = useCallback(() => {
    if (isOtherUserOnline !== undefined && !isOtherUserOnline) {
      toast.error(t("UserOfflineCannotMakeCallError"));
      return false;
    }
    if (isInCall || isIncomingCall || isCalling) {
      toast.error(t("YouAreInCallError"));
      return false;
    }
    return true;
  }, [isCalling, isInCall, isIncomingCall, isOtherUserOnline, t]);

  const handelVoiceCall = async () => {
    if (!canCall()) {
      return;
    }
    const mic = await navigator.permissions.query({ name: "microphone" });
    if (mic.state === "denied") {
      toast.error(t("AllowMicrophoneError"));
      return;
    }
    if (mic.state === "granted") {
      call("voice", { _id, name, userProfileImage });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      stream.getTracks().forEach((track) => {
        track.stop();
      });
      call("voice", { _id, name, userProfileImage });
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const handelVedioCall = async () => {
    if (!canCall()) {
      return;
    }
    const camera = await navigator.permissions.query({ name: "camera" });
    const mic = await navigator.permissions.query({ name: "microphone" });
    if (camera.state === "denied" || mic.state === "denied") {
      toast.error(t("AllowCameraAndMicrophoneError"));
      return;
    }
    if (camera.state === "granted" && mic.state === "granted") {
      call("video", { _id, name, userProfileImage });
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      call("video", { _id, name, userProfileImage });
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const isOnlineElement =
    isOtherUserOnline === undefined ? null : isOtherUserOnline ? (
      <>
        <div className="h-2 w-2 rounded-full bg-green-500"></div> {t("Online")}
      </>
    ) : (
      <>
        <div className="h-2 w-2 rounded-full bg-red-500"></div> {t("Offline")}
      </>
    );

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
          <div
            className={clsx(
              "flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400",
              isTyping && "animate-pulse",
            )}
          >
            {isTyping ? t("Typing") : isOnlineElement}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          className="cursor-pointer rounded-full p-2 hover:bg-gray-100 dark:hover:bg-slate-700"
          onClick={handelVoiceCall}
        >
          <LuPhone className="h-5 w-5 text-slate-500 dark:text-slate-400" />
        </button>
        <button
          className="cursor-pointer rounded-full p-2 hover:bg-gray-100 dark:hover:bg-slate-700"
          onClick={handelVedioCall}
        >
          <LuVideo className="h-5 w-5 text-slate-500 dark:text-slate-400" />
        </button>
        <ConversationMenu />
      </div>
    </div>
  );
};

export default ConversationHeader;
