import { formatVideoTime } from "@/lib/utils";
import { chatSocket } from "@/src/socket";
import { useCallStore } from "@/store/callStore";
import { useUserStore } from "@/store/userStore";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import CallingFooter from "./CallingFooter";
import IncomingCallFooter from "./IncomingCallFooter";

const Call = () => {
  const userId = useUserStore((state) => state.user?._id);
  const initialized = useRef(false);
  const [receivedStream, setReceivedStream] = useState<MediaStream | null>(
    null,
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [audioTime, setAudioTime] = useState(0);
  const { caller, callee, isIncomingCall, changeCallId, callType, callState } =
    useCallStore(
      useShallow((state) => ({
        caller: state.caller,
        callee: state.callee,
        isIncomingCall: state.isIncomingCall,
        changeCallId: state.changeCallId,
        callType: state.callType,
        callState: state.callState,
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
        (data: { success: boolean; callId: string }) => {
          if (data.success) {
            changeCallId(data.callId);
          }
        },
      );
    } catch (error) {
      console.log(error);
    }
  }, [callee, isIncomingCall, changeCallId, callType]);

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
    <div className="fixed top-0 left-0 z-50 h-svh w-svw bg-site-background">
      <div className="flex h-5/6 flex-col items-center justify-center">
        <div className="relative flex h-52 w-52 items-center justify-center rounded-full border-2 border-white dark:border-slate-800">
          <Image
            className="rounded-full object-cover"
            src={otherSide?.userProfileImage || "/imgs/user.jpg"}
            alt="avatar"
            fill
          />
        </div>
        <h1 className="mt-4 text-2xl font-bold">{otherSide?.name}</h1>
        <p className="text-md text-gray-500">
          {receivedStream ? formatVideoTime(audioTime) : "Calling..."}
        </p>
        {receivedStream && callType === "video" && (
          <video
            className="h-52 w-52 bg-black object-cover"
            ref={videoRef}
            autoPlay
            playsInline
          />
        )}
        {receivedStream && callType === "voice" && (
          <audio
            ref={audioRef}
            onTimeUpdate={(e) => setAudioTime((e.target as any).currentTime)}
          />
        )}
      </div>
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
      {isIncomingCall && callState === "Waiting" && (
        <audio src="/ringtone.mp3" autoPlay className="invisible fixed" />
      )}
    </div>
  );
};

export default Call;
