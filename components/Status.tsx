import { useStatusStore } from "@/store/statusStore";
import { motion } from "motion/react";
import { LuCircleDotDashed } from "react-icons/lu";
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
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "tween", duration: 0.1, ease: "easeOut" }}
          className="hidden w-7/12 flex-col items-center justify-center bg-site-foreground select-none md:flex"
        >
          <LuCircleDotDashed size={100} />

          <p className="mt-5 text-center text-xl">Share status updates</p>
          <p className="text-md mt-1 p-9 pt-0 text-center text-slate-400">
            Share photos, videos and text that disappear after 24 hours.
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default Status;
