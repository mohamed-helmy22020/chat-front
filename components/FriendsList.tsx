import { useUserStore } from "@/store/userStore";
import { motion } from "motion/react";
import { IoAlertCircleSharp } from "react-icons/io5";
import { LuUsers } from "react-icons/lu";
import ReceivedRequestsList from "./ReceivedRequestsList";
import RequestUserCard from "./RequestUserCard";
import SearchUsers from "./SearchUsers";
import SentRequestsList from "./SentRequestsList";
import { Alert, AlertTitle } from "./ui/alert";

const FriendsList = () => {
  const friendsList = useUserStore((state) => state.friendsList);

  const friendsListElements = friendsList.map((friend) => (
    <RequestUserCard key={friend._id} user={friend} />
  ));
  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-col border-e-2 md:w-5/12">
        <div className="flex items-center justify-between p-5">
          <h1>Friends List</h1>
          <div className="flex">
            <SentRequestsList />
            <ReceivedRequestsList />
            <SearchUsers />
          </div>
        </div>

        {friendsListElements.length > 0 ? (
          <div className="flex-1 overflow-y-auto p-2">
            {friendsListElements}
          </div>
        ) : (
          <div className="p-5">
            <Alert variant="warning" className="bg-site-foreground">
              <IoAlertCircleSharp />
              <AlertTitle>You dont have any friends</AlertTitle>
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
        <LuUsers size={100} />
        <p className="mt-5 text-center text-xl">Friends List</p>
        <p className="text-md mt-1 p-9 pt-0 text-center text-slate-400">
          See friends list, sent requests, and received requests.
          <br /> You can also unfriend, or block someone.
        </p>
      </motion.div>
    </div>
  );
};

export default FriendsList;
