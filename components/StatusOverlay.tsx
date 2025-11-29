import { seeStatus } from "@/lib/actions/user.actions";
import { useStatusStore } from "@/store/statusStore";
import { memo, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { useShallow } from "zustand/react/shallow";
import StatusContent from "./StatusContent";
import StatusReplay from "./StatusReplay";
import StatusTopContent from "./StatusTopContent";
import StatusViewers from "./StatusViewers";
import { Button } from "./ui/button";
const StatusViewersMemo = memo(StatusViewers);

const StatusOverlay = () => {
  const {
    currentStatus,
    currentStatusTime,
    currentStatusInterval,
    changeCurrentStatusTime,
    nextStatus,
    previousStatus,
    isPlaying,
    changeIsPlaying,
    seeStatusState,
  } = useStatusStore(
    useShallow((state) => ({
      currentStatus: state.currentStatus,
      currentStatusTime: state.currentStatusTime,
      currentStatusInterval: state.currentStatusInterval,
      changeCurrentStatusTime: state.changeCurrentStatusTime,
      nextStatus: state.nextStatus,
      previousStatus: state.previousStatus,
      isPlaying: state.isPlaying,
      changeIsPlaying: state.changeIsPlaying,
      seeStatusState: state.seeStatus,
    })),
  );
  const currentOpenedStatus =
    currentStatus?.statuses[currentStatus.currentIndex];

  useEffect(() => {
    if (
      (currentStatusTime === 0 && currentStatusInterval === 0) ||
      currentStatusTime > currentStatusInterval ||
      currentOpenedStatus?.mediaType === "video" ||
      !isPlaying
    )
      return;
    const interval = setInterval(() => {
      changeCurrentStatusTime(
        currentStatusInterval - currentStatusTime >= 500
          ? currentStatusTime + 500
          : currentStatusTime + currentStatusInterval - currentStatusTime,
      );
      if (currentStatusTime >= currentStatusInterval) {
        clearInterval(interval);
        nextStatus();
      }
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, [
    currentStatusTime,
    currentStatusInterval,
    changeCurrentStatusTime,
    nextStatus,
    currentOpenedStatus,
    isPlaying,
  ]);

  useEffect(() => {
    const seeStatusFunc = async () => {
      if (currentStatus === null || !currentOpenedStatus) {
        return;
      }
      if (!("isSeen" in currentOpenedStatus)) {
        return;
      }

      if (currentOpenedStatus.isSeen) {
        return;
      }
      try {
        await seeStatus(currentOpenedStatus._id);
        seeStatusState(currentOpenedStatus._id);
      } catch (error) {
        console.log(error);
      }
    };
    seeStatusFunc();
  }, [currentStatus, currentOpenedStatus, seeStatusState]);

  useEffect(() => {
    const handleBlur = () => {
      changeIsPlaying(false);
    };

    const handleFocus = () => {
      changeIsPlaying(true);
    };

    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, [changeIsPlaying]);

  return (
    <div className="fixed top-0 left-0 z-50 h-full w-full bg-black">
      {/* overlay content */}
      <div className="absolute top-0 left-0 z-20 flex h-full w-full flex-col">
        <StatusTopContent />
        {/* middle content */}
        <div className="flex w-full flex-1 items-center justify-between px-6">
          <div>
            {(currentStatus?.currentIndex || 0) > 0 && (
              <Button
                className="h-8 w-8 cursor-pointer rounded-full bg-site-foreground/30"
                variant="ghostFull"
                onClick={previousStatus}
              >
                <FaChevronLeft />
              </Button>
            )}
          </div>
          <div>
            <Button
              className="h-8 w-8 cursor-pointer rounded-full bg-site-foreground/30"
              variant="ghostFull"
              onClick={nextStatus}
            >
              <FaChevronRight />
            </Button>
          </div>
        </div>
        {/* bottom content */}
        <div className="flex w-full flex-col bg-linear-to-b from-black/40 to-black/60 pt-3">
          {currentOpenedStatus?.content &&
            ["image", "video"].includes(currentOpenedStatus.mediaType) && (
              <div className="mx-auto mb-3 w-xl text-center select-none">
                {currentOpenedStatus?.content}
              </div>
            )}
          {currentStatus?.isMe && <StatusViewersMemo />}
          {!currentStatus?.isMe && <StatusReplay />}
        </div>
      </div>
      {/* status content */}
      <StatusContent
        key={currentStatus?.currentIndex}
        status={currentOpenedStatus}
      />
    </div>
  );
};

export default StatusOverlay;
