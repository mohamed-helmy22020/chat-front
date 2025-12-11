import { useUserStore } from "@/store/userStore";
import { motion } from "motion/react";
import { LuCheck, LuUserRoundX } from "react-icons/lu";
import RequestUserCard from "./RequestUserCard";
import { Alert, AlertTitle } from "./ui/alert";

const BlockedList = () => {
  const blockedList = useUserStore((state) => state.blockedList);

  const friendsListElements = blockedList.map((user) => (
    <RequestUserCard key={user._id} user={user} type="blocks" />
  ));
  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-col border-e-2 md:w-5/12">
        <div className="flex items-center justify-between p-5">
          <h1>Blocked List</h1>
        </div>

        {friendsListElements.length > 0 ? (
          <div className="flex-1 overflow-y-auto p-2">
            {friendsListElements}
          </div>
        ) : (
          <div className="p-5">
            <Alert className="bg-site-foreground">
              <LuCheck />
              <AlertTitle>You dont have any blocks</AlertTitle>
            </Alert>
          </div>
        )}
      </div>
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "tween", duration: 0.1, ease: "easeOut" }}
        className="hidden w-7/12 flex-col items-center justify-center bg-site-foreground select-none md:flex"
      >
        <LuUserRoundX size={100} />
        <p className="mt-5 text-center text-xl">Blocked List</p>
        <p className="text-md mt-1 p-9 pt-0 text-center text-slate-400">
          See the people you{"'"}ve blocked.
          <br /> You can also unblock them.
        </p>
      </motion.div>
    </div>
  );
};

export default BlockedList;
