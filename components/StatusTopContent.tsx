import { formatDateToStatus } from "@/lib/utils";
import { useStatusStore } from "@/store/statusStore";
import Image from "next/image";
import { FaArrowLeft } from "react-icons/fa6";
import { HiMiniSpeakerWave, HiMiniSpeakerXMark } from "react-icons/hi2";
import { IoIosPause, IoIosPlay } from "react-icons/io";
import { useShallow } from "zustand/react/shallow";
import StatusMenu from "./StatusMenu";
import { Button } from "./ui/button";

const StatusTopContent = () => {
  const {
    currentStatus,
    changeCurrentStatue,
    currentStatusInterval,
    currentStatusTime,
    isPlaying,
    isMuted,
    changeIsPlaying,
    changeIsMuted,
  } = useStatusStore(
    useShallow((state) => ({
      currentStatus: state.currentStatus,
      changeCurrentStatue: state.changeCurrentStatus,
      currentStatusTime: state.currentStatusTime,
      currentStatusInterval: state.currentStatusInterval,
      isPlaying: state.isPlaying,
      isMuted: state.isMuted,
      changeIsPlaying: state.changeIsPlaying,
      changeIsMuted: state.changeIsMuted,
    })),
  );
  const statusUser = currentStatus?.statuses[0].userId;
  const closeStatus = () => {
    changeCurrentStatue(null);
  };
  return (
    <div className="relative flex w-full items-center bg-linear-to-t from-black/40 to-black/60 pt-2.5 pb-3">
      <Button
        onClick={closeStatus}
        variant="ghostFull"
        className="mx-4 cursor-pointer p-1"
      >
        <FaArrowLeft />
      </Button>
      <div className="flex flex-1 flex-col items-center pt-2">
        <div className="flex w-sm gap-1">
          {currentStatus?.statuses
            .filter((_, i) => i < currentStatus.currentIndex)
            .map((status) => (
              <div
                key={status._id}
                className="h-1.5 flex-1 rounded-full bg-white"
              ></div>
            ))}
          {
            <div
              key={currentStatus?.currentIndex}
              className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/35"
            >
              <div
                className="status-transition h-full rounded-full bg-white"
                style={{
                  width: `${Math.floor((currentStatusTime / currentStatusInterval) * 100 || 0)}%`,
                }}
              ></div>
            </div>
          }
          {currentStatus?.statuses
            .filter((_, i) => i > currentStatus.currentIndex)
            .map((status) => (
              <div
                key={status._id}
                className="h-1.5 flex-1 rounded-full bg-white opacity-35"
              ></div>
            ))}
        </div>
        <div className="mt-2 flex w-sm items-center gap-2">
          <div className="relative flex h-7 w-7 overflow-hidden rounded-full">
            <Image
              alt="userPage"
              src={statusUser?.userProfileImage || "/imgs/user.jpg"}
              fill
            />
          </div>
          <div className="flex-1">
            <h1 className="text-md text-white">{statusUser?.name}</h1>
            <div className="text-xs text-gray-300">
              {formatDateToStatus(
                currentStatus?.statuses[currentStatus.currentIndex]
                  .createdAt as string,
              )}
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              onClick={() => changeIsPlaying(!isPlaying)}
              variant="ghostFull"
              className="cursor-pointer !p-0"
            >
              {isPlaying ? <IoIosPause /> : <IoIosPlay />}
            </Button>
            <Button
              onClick={() => changeIsMuted(!isMuted)}
              variant="ghostFull"
              className="cursor-pointer !p-0"
            >
              {isMuted ? <HiMiniSpeakerXMark /> : <HiMiniSpeakerWave />}
            </Button>
          </div>
        </div>
      </div>
      <StatusMenu />
    </div>
  );
};

export default StatusTopContent;
