import { sortStatuses } from "@/lib/utils";
import { useStatusStore } from "@/store/statusStore";
import { JSX } from "react";
import StatusCard from "./StatusCard";

const Statuses = () => {
  const friendsStatuses = useStatusStore((state) => state.friendsStatuses);
  const sortedFriendsStatuses = sortStatuses(friendsStatuses);
  const ViewedStatusesElements: JSX.Element[] = [];
  const RecentStatusesElements: JSX.Element[] = [];
  for (let i = 0; i < sortedFriendsStatuses.length; i++) {
    const isSeen = sortedFriendsStatuses[i].reduce(
      (acc: boolean, curr: FriendsStatusType) => acc && curr.isSeen,
      false,
    );
    console.log(isSeen);
    if (isSeen) {
      ViewedStatusesElements.push(
        <StatusCard
          key={sortedFriendsStatuses[i][0]._id}
          user={sortedFriendsStatuses[i][0].userId}
          isSeen={isSeen}
          date={sortedFriendsStatuses[i][0].createdAt}
        />,
      );
    } else {
      RecentStatusesElements.push(
        <StatusCard
          key={sortedFriendsStatuses[i][0]._id}
          user={sortedFriendsStatuses[i][0].userId}
          isSeen={isSeen}
          date={sortedFriendsStatuses[i][0].createdAt}
        />,
      );
    }
  }
  return (
    <div className="flex flex-col px-3 select-none">
      {RecentStatusesElements.length > 0 && (
        <>
          <p className="my-5 mt-5 px-4 text-gray-400">Recent</p>
          <div className="flex flex-col">{RecentStatusesElements}</div>
        </>
      )}
      {ViewedStatusesElements.length > 0 && (
        <>
          <p className="my-5 mt-5 px-4 text-gray-400">Viewed</p>
          <div className="flex flex-col">{ViewedStatusesElements}</div>
        </>
      )}
    </div>
  );
};

export default Statuses;
