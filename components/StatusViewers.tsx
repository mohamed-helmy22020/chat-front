import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useStatusStore } from "@/store/statusStore";
import { useEffect, useState } from "react";
import { IoEyeOutline } from "react-icons/io5";
import { useShallow } from "zustand/react/shallow";
import StatusViewersList from "./StatusViewersList";
import { Button } from "./ui/button";
const StatusViewers = () => {
  const [isListOpen, setIsListOpen] = useState(false);
  const { viewers, changeIsPlaying, isPlaying } = useStatusStore(
    useShallow((state) => {
      const status = state.currentStatus?.statuses[
        state.currentStatus?.currentIndex ?? 0
      ] as UserStatusType | undefined;
      return {
        viewers: status?.viewers ?? [],
        changeIsPlaying: state.changeIsPlaying,
        isPlaying: state.isPlaying,
      };
    }),
  );

  useEffect(() => {
    if (isListOpen) {
      changeIsPlaying(false);
    } else {
      changeIsPlaying(true);
    }
  }, [isListOpen, changeIsPlaying]);
  useEffect(() => {
    if (isListOpen) {
      changeIsPlaying(false);
    }
  }, [isPlaying, isListOpen, changeIsPlaying]);

  return (
    <>
      <div className="mb-5 flex items-center justify-center gap-2 select-none">
        <Dialog open={isListOpen} onOpenChange={setIsListOpen}>
          <DialogTrigger asChild>
            <Button variant="ghostFull" className="cursor-pointer">
              <IoEyeOutline /> {viewers.length}
            </Button>
          </DialogTrigger>
          <StatusViewersList viewers={viewers} />
        </Dialog>
      </div>
    </>
  );
};

export default StatusViewers;
