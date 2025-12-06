import { chatSocket } from "@/src/socket";
import { useCallStore } from "@/store/callStore";
import { useEffect, useRef, useState } from "react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa6";
import { HiMiniSpeakerWave, HiMiniSpeakerXMark } from "react-icons/hi2";
import { MdCallEnd } from "react-icons/md";
import SimplePeer from "simple-peer";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { Button } from "./ui/button";

const CallingFooter = ({
  setReceivedStream,
  handleToggleMuteSound,
}: {
  setReceivedStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
  handleToggleMuteSound: () => void;
}) => {
  const stream = useRef<MediaStream>(null);
  const peer = useRef<SimplePeer.Instance>(null);
  const [isSpeakerOff, setIsSpeakerOff] = useState(false);
  const [isMicOff, setIsMicOff] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { callId, callState, callee, endCall, changeCallState, callType } =
    useCallStore(
      useShallow((state) => ({
        callId: state.callId,
        callState: state.callState,
        callee: state.callee,
        changeCallState: state.changeCallState,
        endCall: state.endCall,
        callType: state.callType,
      })),
    );
  const handleToggleSpeaker = () => {
    setIsSpeakerOff((prev) => !prev);
    handleToggleMuteSound();
  };
  const handleToggleMic = () => {
    stream.current?.getAudioTracks().forEach((track) => {
      track.enabled = isMicOff;
    });
    setIsMicOff((prev) => !prev);
  };
  const handleEndCall = () => {
    endCall();
  };
  useEffect(() => {
    const onAccepted = async () => {
      changeCallState("Accepted");
    };
    const onCallEnded = async () => {
      changeCallState("Rejected");
      toast.info("Call Ended");
      endCall();
    };
    chatSocket.on("callEnded", onCallEnded);
    chatSocket.on("callAccepted", onAccepted);

    return () => {
      chatSocket.off("callAccepted", onAccepted);
      chatSocket.off("callEnded", onCallEnded);
    };
  }, [changeCallState, endCall]);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (callState === "Waiting" || !isConnected) {
        endCall();
      }
    }, 10000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [callState, endCall, isConnected]);
  useEffect(() => {
    if (callState !== "Accepted") return;
    const connect = async () => {
      stream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: callType === "video",
      });

      peer.current = new SimplePeer({
        initiator: true,
        stream: stream.current,
        config: {
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            {
              urls: "turn:turn.anyfirewall.com:443?transport=tcp",
              credential: "webrtc",
              username: "webrtc",
            },
          ],
        },
      });
      const peerInstance = peer.current;
      peerInstance.on("connect", () => {
        setIsConnected(true);
      });
      peerInstance.on("signal", (data: any) => {
        chatSocket.emit("signal", { to: callee?._id, callId, data });
      });
      peerInstance.on("stream", (remoteStream) => {
        setReceivedStream(remoteStream);
      });
      peerInstance.on("error", (err) => {
        console.log("Peer error:", err);
      });
      peerInstance.on("close", () => {
        toast.info("Call ended");
        endCall();
      });
    };
    connect();
    const onSignal = (data: {
      callId: string;
      signalData: string | SimplePeer.SignalData;
    }) => {
      if (callId !== data.callId) return;
      peer.current?.signal(data.signalData);
    };
    chatSocket.on("signal", onSignal);

    return () => {
      if (stream.current) {
        stream.current.getTracks().forEach((track) => {
          track.stop();
        });
        stream.current = null;
      }
      if (peer.current) {
        peer.current.destroy();
        peer.current = null;
      }
      chatSocket.off("signal", onSignal);
    };
  }, [callee, callState, callId, setReceivedStream, endCall, callType]);
  return (
    <div className="flex h-1/6 items-center justify-center gap-10 bg-site-foreground p-2">
      <Button
        className="aspect-square h-10 scale-125 cursor-pointer rounded-full bg-transparent !p-0 text-white hover:bg-site-background hover:opacity-90"
        onClick={handleToggleSpeaker}
      >
        {isSpeakerOff ? <HiMiniSpeakerXMark /> : <HiMiniSpeakerWave />}
      </Button>
      <Button
        className="aspect-square h-10 scale-125 cursor-pointer rounded-full bg-transparent !p-0 text-white hover:bg-site-background hover:opacity-90"
        onClick={handleToggleMic}
      >
        {isMicOff ? <FaMicrophoneSlash /> : <FaMicrophone />}
      </Button>
      <Button
        variant="destructive"
        className="aspect-square h-10 cursor-pointer rounded-full !p-0 hover:opacity-90"
        onClick={handleEndCall}
      >
        <MdCallEnd />
      </Button>
    </div>
  );
};

export default CallingFooter;
