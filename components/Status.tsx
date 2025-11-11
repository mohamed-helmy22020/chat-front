import {
  getFriendsStatuses,
  getUserStatuses,
} from "@/lib/actions/user.actions";
import { useStatusStore } from "@/store/statusStore";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import AddStatus from "./AddStatus";
import MyStatus from "./MyStatus";
import Statuses from "./Statuses";
import StatusOverlay from "./StatusOverlay";

const Status = () => {
  const { changeUserStatuses, changeFriendsStatuses, currentStatus } =
    useStatusStore(
      useShallow((state) => ({
        changeUserStatuses: state.changeUserStatuses,
        changeFriendsStatuses: state.changeFriendsStatuses,
        currentStatus: state.currentStatus,
      })),
    );
  useEffect(() => {
    const getStatuses = async () => {
      const [userStatusesRes, friendsStatusesRes] = await Promise.all([
        getUserStatuses(),
        getFriendsStatuses(),
      ]);
      if (userStatusesRes.success) {
        changeUserStatuses(userStatusesRes.statuses);
      }
      if (friendsStatusesRes.success) {
        changeFriendsStatuses(friendsStatusesRes.statuses);
      }
    };
    getStatuses();
  }, [changeUserStatuses, changeFriendsStatuses]);

  return (
    <>
      {currentStatus && <StatusOverlay />}
      <div className="flex flex-1">
        <div className="flex max-h-screen w-5/12 flex-col border-e-2">
          <div className="flex items-center justify-between p-5">
            <h1>Status</h1>
            <div className="flex">
              <AddStatus />
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <MyStatus />
            <Statuses />
          </div>
        </div>
        <div className="flex w-7/12 items-center justify-center">a</div>
      </div>
    </>
  );
};

export default Status;
