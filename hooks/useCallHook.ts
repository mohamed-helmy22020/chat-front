import { chatSocket } from "@/src/socket";
import { useCallStore } from "@/store/callStore";
import { useUserStore } from "@/store/userStore";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import SimplePeer from "simple-peer";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

const useCallHook = (initiator: boolean) => {
  const t = useTranslations("Chat.Conversation.Call");
  const userId = useUserStore((state) => state.user?._id);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [peer, setPeer] = useState<SimplePeer.Instance | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [receivedStream, setReceivedStream] = useState<MediaStream | null>(
    null,
  );
  const {
    callId,
    callState,
    caller,
    callee,
    endCall,
    changeCallState,
    callType,
  } = useCallStore(
    useShallow((state) => ({
      callId: state.callId,
      callState: state.callState,
      caller: state.caller,
      callee: state.callee,
      changeCallState: state.changeCallState,
      endCall: state.endCall,
      callType: state.callType,
    })),
  );
  const otherSide = caller?._id === userId ? callee : caller;
  useEffect(() => {
    const onAccepted = async () => {
      changeCallState("Accepted");
    };
    const onCallEnded = async () => {
      changeCallState("Rejected");
      toast.info(t("CallEnded"));
      endCall();
    };
    const onSignal = (data: {
      callId: string;
      signalData: string | SimplePeer.SignalData;
    }) => {
      if (callId !== data.callId) return;
      peer?.signal(data.signalData);
    };
    chatSocket.on("callAccepted", onAccepted);
    chatSocket.on("callEnded", onCallEnded);
    chatSocket.on("signal", onSignal);

    return () => {
      chatSocket.off("callAccepted", onAccepted);
      chatSocket.off("callEnded", onCallEnded);
      chatSocket.off("signal", onSignal);
    };
  }, [changeCallState, endCall, callId, peer, initiator, t]);

  useEffect(() => {
    if (callState !== "Accepted") return;
    const connect = async () => {
      try {
        const streamInstance = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: callType === "video",
        });
        setStream(streamInstance);
      } catch (error) {
        console.log(error);
        toast.error(t("AllowMicrophone"));
        endCall();
      }
    };
    connect();
  }, [callState, callType, endCall, t]);

  useEffect(() => {
    if (!stream) return;

    const peerInstance = new SimplePeer({
      initiator,
      stream: stream,
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
    setPeer(peerInstance);
  }, [stream, initiator]);

  useEffect(() => {
    if (!peer) return;
    const onConnect = () => {
      setIsConnected(true);
    };
    const onSignal = (data: any) => {
      chatSocket.emit("signal", { to: otherSide?._id, callId, data });
    };
    const onStream = (remoteStream: MediaStream) => {
      setReceivedStream(remoteStream);
    };
    const onError = (err: any) => {
      console.log("Peer error:", err);
    };
    const onClose = () => {
      toast.info(t("CallEnded"));
      endCall();
    };

    peer.on("connect", onConnect);
    peer.on("signal", onSignal);
    peer.on("stream", onStream);
    peer.on("error", onError);
    peer.on("close", onClose);

    return () => {
      peer.off("connect", onConnect);
      peer.off("signal", onSignal);
      peer.off("stream", onStream);
      peer.off("error", onError);
      peer.off("close", onClose);
    };
  }, [
    peer,
    stream,
    otherSide,
    callState,
    callId,
    setReceivedStream,
    endCall,
    callType,
    t,
  ]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
          setStream(null);
        });
      }
    };
  }, [stream]);
  useEffect(() => {
    return () => {
      if (peer) {
        peer.destroy();
        setPeer(null);
      }
    };
  }, [peer]);

  return {
    stream,
    peer,
    isConnected,
    receivedStream,
  };
};

export default useCallHook;
