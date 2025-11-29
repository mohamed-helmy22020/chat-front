import { formatRelativeDate } from "@/lib/utils";
import Image from "next/image";

type Props = {
  viewer: UserStatusType["viewers"][0];
};

const StatusViewerCard = ({
  viewer: {
    user: { name, userProfileImage },
    createdAt,
  },
}: Props) => {
  return (
    <div className="flex w-full items-center gap-2">
      <div className="relative flex min-h-9 min-w-9 items-center justify-center rounded-full">
        <Image
          className="rounded-full object-cover"
          src={userProfileImage || "/imgs/user.jpg"}
          alt="avatar"
          fill
        />
      </div>
      <div className="flex flex-1 flex-col items-start justify-center">
        <h1 className="text-md font-bold capitalize">{name}</h1>
        <p className="line-clamp-1 text-sm text-gray-500">
          {formatRelativeDate(createdAt)}
        </p>
      </div>
    </div>
  );
};

export default StatusViewerCard;
