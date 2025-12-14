import { formatVideoTime } from "@/lib/utils";
import { chatSocket } from "@/src/socket";
import { useCallStore } from "@/store/callStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useUserStore } from "@/store/userStore";
import clsx from "clsx";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import CallingFooter from "./CallingFooter";
import IncomingCallFooter from "./IncomingCallFooter";

const Call = () => {
  const t = useTranslations("Chat.Conversation.Call");
  const userId = useUserStore((state) => state.user?._id);
  const initialized = useRef(false);
  const [receivedStream, setReceivedStream] = useState<MediaStream | null>(
    null,
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [mediaTime, setMediaTime] = useState(0);
  const incomingCallsSoundSetting = useSettingsStore(
    (state) => state.notifcationsSettings.incomingCallsSound,
  );
  const {
    caller,
    callee,
    isIncomingCall,
    changeCallId,
    callType,
    callState,
    endCall,
  } = useCallStore(
    useShallow((state) => ({
      caller: state.caller,
      callee: state.callee,
      isIncomingCall: state.isIncomingCall,
      changeCallId: state.changeCallId,
      callType: state.callType,
      callState: state.callState,
      endCall: state.endCall,
    })),
  );
  const otherSide = caller?._id === userId ? callee : caller;
  useEffect(() => {
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    if (!callee || isIncomingCall) return;
    try {
      chatSocket.emit(
        "call",
        callee?._id,
        callType,
        (data: { success: boolean; callId: string; error?: string }) => {
          if (data.success) {
            changeCallId(data.callId);
          } else {
            toast.error(data.error);
            endCall();
          }
        },
      );
    } catch (error) {
      console.log(error);
    }
  }, [callee, isIncomingCall, changeCallId, callType, endCall]);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;
    if (!receivedStream) return;
    if (callType !== "voice") return;
    audioElement.srcObject = receivedStream;
    audioElement.play();
  }, [receivedStream, callType]);
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    if (!receivedStream) return;
    if (callType !== "video") return;
    videoElement.srcObject = receivedStream;
    videoElement.play();
  }, [receivedStream, callType]);
  const handleToggleMuteSound = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
    }
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "tween" }}
      className="fixed top-0 left-0 z-50 flex h-svh w-svw flex-col bg-site-background"
    >
      <div
        className={clsx(
          "flex flex-col items-center justify-center gap-4",
          (callType === "voice" || callState === "Waiting") && "flex-1",
          callType === "video" &&
            callState === "Accepted" &&
            "flex-row justify-start p-4",
        )}
      >
        <div
          className={clsx(
            "relative flex h-52 w-52 items-center justify-center rounded-full border-2 border-white transition-all dark:border-slate-800",
            callType === "video" && callState === "Accepted" && "!h-9 !w-9",
          )}
        >
          <Image
            className="rounded-full object-cover"
            src={otherSide?.userProfileImage || "/imgs/user.jpg"}
            alt="avatar"
            fill
          />
        </div>

        <h1
          className={clsx(
            "text-2xl font-bold",
            callType === "video" && callState === "Accepted" && "flex-1",
          )}
        >
          {otherSide?.name}
        </h1>

        <p className="text-md text-gray-500">
          {receivedStream
            ? formatVideoTime(mediaTime)
            : callState === "Accepted"
              ? t("Connecting")
              : t("Calling")}
        </p>

        {receivedStream && callType === "voice" && (
          <audio
            ref={audioRef}
            onTimeUpdate={(e) => setMediaTime((e.target as any).currentTime)}
          />
        )}
      </div>
      {callType === "video" && callState === "Accepted" && (
        <div className="flex-1">
          <div className="relative h-full w-full bg-black">
            <video
              className="absolute top-1/2 left-1/2 max-h-full max-w-full -translate-1/2 bg-black object-cover"
              ref={videoRef}
              autoPlay
              playsInline
              onTimeUpdate={(e) => setMediaTime((e.target as any).currentTime)}
            />
          </div>
        </div>
      )}
      {isIncomingCall ? (
        <IncomingCallFooter
          setReceivedStream={setReceivedStream}
          handleToggleMuteSound={handleToggleMuteSound}
        />
      ) : (
        <CallingFooter
          setReceivedStream={setReceivedStream}
          handleToggleMuteSound={handleToggleMuteSound}
        />
      )}
      {isIncomingCall &&
        callState === "Waiting" &&
        incomingCallsSoundSetting === "Enable" && (
          <audio src="/ringtone.mp3" autoPlay className="invisible fixed" />
        )}
    </motion.div>
  );
};

export default Call;
