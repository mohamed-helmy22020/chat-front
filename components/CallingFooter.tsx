import useCallHook from "@/hooks/useCallHook";
import { useCallStore } from "@/store/callStore";
import { useEffect } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import InCallButtons from "./InCallButtons";

const CallingFooter = ({
  setReceivedStream,
  handleToggleMuteSound,
}: {
  setReceivedStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
  handleToggleMuteSound: () => void;
}) => {
  const { callState, endCall } = useCallStore(
    useShallow((state) => ({
      callState: state.callState,
      endCall: state.endCall,
    })),
  );

  const { stream, isConnected, receivedStream } = useCallHook(true);
  useEffect(() => {
    setReceivedStream(receivedStream);
  }, [receivedStream, setReceivedStream]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (callState === "Waiting") {
        toast.info("No answer");
        endCall();
      }
    }, 30000);
    const timeoutId2 = setTimeout(() => {
      if (!isConnected && callState === "Accepted") {
        toast.error("Error happened when connecting");
        endCall();
      }
    }, 5000);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(timeoutId2);
    };
  }, [callState, endCall, isConnected]);

  return (
    <div className="flex h-1/6 items-center justify-center gap-10 bg-site-foreground p-2">
      <InCallButtons
        handleToggleMuteSound={handleToggleMuteSound}
        stream={stream}
      />
    </div>
  );
};

export default CallingFooter;
