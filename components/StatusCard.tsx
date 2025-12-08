import { formatDateToStatus } from "@/lib/utils";
import { useStatusStore } from "@/store/statusStore";
import clsx from "clsx";
import { motion } from "motion/react";
import Image from "next/image";
import { Button } from "./ui/button";

type Props = {
  user: MiniUserType;
  isSeen: boolean;
  date: string;
};
const StatusCard = ({
  user: { _id: userId, name, userProfileImage },
  isSeen,
  date,
}: Props) => {
  const changeCurrentStatus = useStatusStore(
    (state) => state.changeCurrentStatus,
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-sm select-none hover:bg-gray-800"
    >
      <Button
        className="flex h-full w-full cursor-pointer gap-3 rounded-sm px-2 py-3"
        variant="ghostFull"
        onClick={() => changeCurrentStatus(userId)}
      >
        <div
          className={clsx(
            "relative flex h-9 w-9 items-center justify-center rounded-full border-[3px]",
            isSeen && "border-gray-500",
            !isSeen && "border-mainColor-600",
          )}
        >
          <Image
            className="rounded-full object-cover"
            src={userProfileImage || "/imgs/user.jpg"}
            alt="avatar"
            fill
          />
        </div>
        <div className="flex flex-1 flex-col items-start justify-center">
          <h2 className="text-sm capitalize">{name}</h2>
          <p className="line-clamp-1 text-xs text-gray-500">
            {formatDateToStatus(date)}
          </p>
        </div>
      </Button>
    </motion.div>
  );
};

export default StatusCard;
