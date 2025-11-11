import { formatDateToStatus } from "@/lib/utils";
import { useStatusStore } from "@/store/statusStore";
import { useUserStore } from "@/store/userStore";
import Image from "next/image";
import { useShallow } from "zustand/react/shallow";
import { Button } from "./ui/button";

const MyStatus = () => {
  const { userId, userProfileImage } = useUserStore(
    useShallow((state) => ({
      userProfileImage: state.user?.userProfileImage,
      userId: state.user?._id,
    })),
  );

  const { userStatuses, changeCurrentStatus } = useStatusStore(
    useShallow((state) => ({
      userStatuses: state.userStatuses,
      changeCurrentStatus: state.changeCurrentStatus,
    })),
  );

  return (
    <div className="mx-3 flex cursor-pointer gap-3 rounded-sm select-none active:bg-gray-800">
      <Button
        className="flex h-full w-full cursor-pointer gap-3 rounded-sm px-2 py-3"
        variant="ghostFull"
        onClick={() => changeCurrentStatus(userId as string, true)}
      >
        <div className="relative h-8 w-8 overflow-hidden">
          <Image
            className="rounded-full object-cover"
            src={userProfileImage || "/imgs/user.jpg"}
            alt="avatar"
            fill
          />
        </div>
        <div className="flex flex-1 flex-col items-start justify-center">
          <h1 className="text-sm capitalize">My status</h1>
          <p className="line-clamp-1 text-xs text-gray-500">
            {userStatuses.length > 0
              ? formatDateToStatus(
                  [...userStatuses].sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime(),
                  )[0]?.createdAt,
                )
              : "No status yet"}
          </p>
        </div>
      </Button>
    </div>
  );
};

export default MyStatus;
