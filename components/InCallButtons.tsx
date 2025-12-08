import { useCallStore } from "@/store/callStore";
import { useState } from "react";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
} from "react-icons/fa6";
import { HiMiniSpeakerWave, HiMiniSpeakerXMark } from "react-icons/hi2";
import { MdCallEnd } from "react-icons/md";
import { useShallow } from "zustand/react/shallow";
import { Button } from "./ui/button";

type Props = {
  handleToggleMuteSound: () => void;
  stream?: MediaStream | null;
};

const InCallButtons = ({ handleToggleMuteSound, stream }: Props) => {
  const { callType, endCall } = useCallStore(
    useShallow((state) => ({
      callType: state.callType,
      endCall: state.endCall,
    })),
  );
  const [isSpeakerOff, setIsSpeakerOff] = useState(false);
  const [isMicOff, setIsMicOff] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const handleToggleMic = () => {
    if (!stream) return;
    stream?.getAudioTracks().forEach((track) => {
      track.enabled = isMicOff;
    });
    setIsMicOff((prev) => !prev);
  };

  const handleToggleCamera = () => {
    if (!stream) return;
    stream?.getVideoTracks().forEach((track) => {
      track.enabled = isCameraOff;
    });
    setIsCameraOff((prev) => !prev);
  };

  const handleToggleSpeaker = () => {
    setIsSpeakerOff((prev) => !prev);
    handleToggleMuteSound();
  };
  return (
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
      {callType === "video" && (
        <Button
          className="aspect-square h-10 scale-125 cursor-pointer rounded-full bg-transparent !p-0 text-white hover:bg-site-background hover:opacity-90"
          onClick={handleToggleCamera}
        >
          {isCameraOff ? <FaVideoSlash /> : <FaVideo />}
        </Button>
      )}
      <Button
        variant="destructive"
        className="aspect-square h-10 cursor-pointer rounded-full !p-0 hover:scale-110 hover:opacity-90"
        onClick={() => endCall()}
      >
        <MdCallEnd />
      </Button>
    </>
  );
};

export default InCallButtons;
