import { getFriendsList } from "@/lib/actions/user.actions";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import RequestUserCard from "./RequestUserCard";
import SearchUsers from "./SearchUsers";

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
          <SearchUsers />
        </div>
        {isLoading && (
          <div className="flex animate-spin items-center justify-center py-10">
            <Loader />
          </div>
        )}
        {!isLoading && (
          <div className="flex-1 overflow-y-auto p-2">
            {friendsListElements}
          </div>
        )}
      </div>
      <div className="flex w-7/12 items-center justify-center">a</div>
    </div>
  );
};

export default FriendsList;
