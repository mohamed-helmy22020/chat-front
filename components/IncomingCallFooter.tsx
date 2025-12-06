import { chatSocket } from "@/src/socket";
import { useCallStore } from "@/store/callStore";
import { useEffect, useRef, useState } from "react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa6";
import { HiMiniSpeakerWave, HiMiniSpeakerXMark } from "react-icons/hi2";
import { MdCall, MdCallEnd } from "react-icons/md";
import SimplePeer from "simple-peer";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { Button } from "./ui/button";

const IncomingCallFooter = ({
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
  const { callState, endCall, caller, callId, changeCallState, callType } =
    useCallStore(
      useShallow((state) => ({
        caller: state.caller,
        endCall: state.endCall,
        callId: state.callId,
        changeCallState: state.changeCallState,
        callState: state.callState,
        callType: state.callType,
      })),
    );
  const handleToggleSpeaker = () => {
    setIsSpeakerOff((prev) => !prev);
    handleToggleMuteSound();
  };
  const handleToggleMic = () => {
    stream.current?.getAudioTracks().forEach((track) => {
      console.log("track", track);
      console.log({ isMicOff });
      track.enabled = isMicOff;
    });
    setIsMicOff((prev) => !prev);
  };
  const handleAcceptCall = () => {
    chatSocket.emit("acceptCall", caller?._id, callId);
    changeCallState("Accepted");
  };
  useEffect(() => {
    if (callState !== "Accepted") return;
    const connect = async () => {
      stream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: callType === "video",
      });
      peer.current = new SimplePeer({
        initiator: false,
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
      peerInstance.on("connect", () => {});

      peerInstance.on("signal", (data: any) => {
        chatSocket.emit("signal", { to: caller?._id, callId, data });
      });
      peerInstance.on("stream", (remoteStream) => {
        setReceivedStream(remoteStream);
      });
      peerInstance.on("error", (err) => {
        console.log("Peer error:", err);
      });
      peerInstance.on("close", () => {
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
  }, [caller, callState, callId, setReceivedStream, endCall, callType]);

  useEffect(() => {
    const onCallEnded = async () => {
      changeCallState("Rejected");
      toast.info("Call Ended");
      endCall();
    };
    chatSocket.on("callEnded", onCallEnded);

    return () => {
      chatSocket.off("callEnded", onCallEnded);
    };
  }, [changeCallState, endCall]);
  const handleEndCall = () => {
    endCall();
  };
  return (
    <div className="flex h-1/6 items-center justify-center gap-10 bg-site-foreground p-2">
      {callState === "Waiting" ? (
        <>
          <Button
            variant="destructive"
            className="aspect-square h-10 cursor-pointer rounded-full !p-0 hover:opacity-90"
            onClick={handleEndCall}
          >
            <MdCallEnd />
          </Button>
          <Button
            variant="ghostFull"
            className="aspect-square !h-10 animate-pulse cursor-pointer rounded-full bg-green-600 !p-0 text-white hover:opacity-90"
            onClick={handleAcceptCall}
          >
            <MdCall />
          </Button>
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default IncomingCallFooter;
