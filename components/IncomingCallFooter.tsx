import useCallHook from "@/hooks/useCallHook";
import { chatSocket } from "@/src/socket";
import { useCallStore } from "@/store/callStore";
import { useEffect } from "react";
import { MdCall, MdCallEnd } from "react-icons/md";
import { useShallow } from "zustand/react/shallow";
import InCallButtons from "./InCallButtons";
import { Button } from "./ui/button";

const IncomingCallFooter = ({
  setReceivedStream,
  handleToggleMuteSound,
}: {
  setReceivedStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
  handleToggleMuteSound: () => void;
}) => {
  const { callState, endCall, caller, callId, changeCallState } = useCallStore(
    useShallow((state) => ({
      caller: state.caller,
      endCall: state.endCall,
      callId: state.callId,
      changeCallState: state.changeCallState,
      callState: state.callState,
    })),
  );

  const handleAcceptCall = () => {
    chatSocket.emit("acceptCall", caller?._id, callId);
    changeCallState("Accepted");
  };

  const { stream, receivedStream } = useCallHook(false);
  useEffect(() => {
    setReceivedStream(receivedStream);
  }, [receivedStream, setReceivedStream]);
  return (
    <div className="flex h-1/6 items-center justify-center gap-10 bg-site-foreground p-2">
      {callState === "Waiting" ? (
        <>
          <Button
            variant="destructive"
            className="aspect-square h-10 cursor-pointer rounded-full !p-0 hover:opacity-90"
            onClick={() => endCall()}
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
        <InCallButtons
          handleToggleMuteSound={handleToggleMuteSound}
          stream={stream}
        />
      )}
    </div>
  );
};

export default IncomingCallFooter;
