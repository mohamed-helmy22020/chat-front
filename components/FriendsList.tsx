import { getFriendsList } from "@/lib/actions/user.actions";
import { useEffect, useState } from "react";
import { FiLoader } from "react-icons/fi";
import { IoAlertCircleSharp } from "react-icons/io5";
import ReceivedRequestsList from "./ReceivedRequestsList";
import RequestUserCard from "./RequestUserCard";
import SearchUsers from "./SearchUsers";
import SentRequestsList from "./SentRequestsList";
import { Alert, AlertTitle } from "./ui/alert";

const FriendsList = () => {
  const [friendsList, setFriendsList] = useState<RequestUserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchFriends = async () => {
      setIsLoading(true);
      try {
        const getFriendsListRes = await getFriendsList();
        console.log(getFriendsListRes);
        setFriendsList(getFriendsListRes.friends);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };
    fetchFriends();
  }, []);

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
        {isLoading && (
          <div className="flex animate-spin items-center justify-center py-10">
            <FiLoader />
          </div>
        )}
        {!isLoading && friendsListElements.length > 0 ? (
          <div className="flex-1 overflow-y-auto p-2">
            {friendsListElements}
          </div>
        ) : !isLoading && friendsListElements.length <= 0 ? (
          <div className="p-5">
            <Alert variant="warning" className="bg-site-foreground">
              <IoAlertCircleSharp />
              <AlertTitle>You dont have any friends</AlertTitle>
            </Alert>
          </div>
        ) : null}
      </div>
      <div className="flex w-7/12 items-center justify-center">a</div>
    </div>
  );
};

export default FriendsList;
