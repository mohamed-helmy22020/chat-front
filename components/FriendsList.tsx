import { useUserStore } from "@/store/userStore";
import { IoAlertCircleSharp } from "react-icons/io5";
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
      <div className="flex h-full w-5/12 flex-col border-e-2">
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
      <div className="flex w-7/12 items-center justify-center">a</div>
    </div>
  );
};

export default FriendsList;
