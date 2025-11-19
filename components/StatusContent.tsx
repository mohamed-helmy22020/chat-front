import { useStatusStore } from "@/store/statusStore";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";

type Props = {
  status?: FriendsStatusType | UserStatusType;
};
const StatusContent = ({ status }: Props) => {
  return (
    <div className="fade-in-element absolute top-0 left-0 z-10 flex h-full w-full items-center justify-center">
      {status?.mediaType === "" && <StatusNoMedia status={status} />}
      {status?.mediaType === "image" && <StatusWithImage status={status} />}
      {status?.mediaType === "video" && <StatusWithVideo status={status} />}
    </div>
  );
};

const StatusNoMedia = ({ status }: Props) => {
  return (
    <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center bg-green-700">
      <p className="max-w-lg">{status?.content}</p>
    </div>
  );
};

const StatusWithImage = ({ status }: Props) => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Image
        src={status?.mediaUrl as string}
        alt="status"
        fill
        className="object-contain"
      />
    </div>
  );
};

const StatusWithVideo = ({ status }: Props) => {
  const {
    changeCurrentStatusTime,
    changeCurrentStatusInterval,
    nextStatus,
    isMuted,
    isPlaying,
  } = useStatusStore(
    useShallow((state) => ({
      changeCurrentStatusTime: state.changeCurrentStatusTime,
      changeCurrentStatusInterval: state.changeCurrentStatusInterval,
      nextStatus: state.nextStatus,
      isPlaying: state.isPlaying,
      isMuted: state.isMuted,
    })),
  );
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const handleLoad = () => {
      setIsLoaded(true);
    };

    const handleError = () => {
      console.error("Failed to load video");
      setHasError(true);
      setIsLoaded(true); // Stop showing loader even if error occurs
    };

    const handleDurationChange = () => {
      changeCurrentStatusTime(0);
      changeCurrentStatusInterval(video.duration * 1000);
    };

    const handleTimeUpdate = () => {
      changeCurrentStatusTime(video.currentTime * 1000);
    };

    const handleEnded = () => {
      nextStatus();
    };

    // Attach event listeners
    video.addEventListener("canplay", handleLoad);
    video.addEventListener("durationchange", handleDurationChange);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("error", handleError);

    // Cleanup function
    return () => {
      video.removeEventListener("canplay", handleLoad);
      video.removeEventListener("durationchange", handleDurationChange);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("error", handleError);
    };
  }, [changeCurrentStatusInterval, changeCurrentStatusTime, nextStatus]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.play();
    } else {
      video.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = isMuted;
  }, [isMuted]);
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {!isLoaded && !hasError && (
        <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center bg-black/70 backdrop-blur-3xl">
          <Loader2 className="animate-spin" />
        </div>
      )}
      <video
        src={status?.mediaUrl}
        autoPlay
        className="h-full w-full object-contain"
        ref={videoRef}
        controls={false}
      />
    </div>
  );
};

export default StatusContent;
