import useCallHook from "@/hooks/useCallHook";
import { useCallStore } from "@/store/callStore";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("Chat.Conversation.Call");
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
        toast.info(t("NoAnswer"));
        endCall();
      }
    }, 30000);
    const timeoutId2 = setTimeout(() => {
      if (!isConnected && callState === "Accepted") {
        toast.error(t("ErrorWhenConnecting"));
        endCall();
      }
    }, 5000);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(timeoutId2);
    };
  }, [callState, endCall, isConnected, t]);

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
