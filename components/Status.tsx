import { useStatusStore } from "@/store/statusStore";
import AddStatus from "./AddStatus";
import MyStatus from "./MyStatus";
import Statuses from "./Statuses";
import StatusOverlay from "./StatusOverlay";

const Status = () => {
  const currentStatus = useStatusStore((state) => state.currentStatus);

  return (
    <>
      {currentStatus && <StatusOverlay />}
      <div className="flex flex-1">
        <div className="flex max-h-svh w-full flex-col border-e-2 md:w-5/12">
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
        <div className="hidden w-7/12 items-center justify-center md:flex">
          a
        </div>
      </div>
    </>
  );
};

export default Status;
