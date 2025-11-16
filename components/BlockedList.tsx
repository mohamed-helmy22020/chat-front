import { getBlockedList } from "@/lib/actions/user.actions";
import { useEffect, useState } from "react";
import { FiLoader } from "react-icons/fi";
import { LuCheck } from "react-icons/lu";
import RequestUserCard from "./RequestUserCard";
import { Alert, AlertTitle } from "./ui/alert";

const BlockedList = () => {
  const [blockedList, setBlockedList] = useState<RequestUserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchBlocks = async () => {
      setIsLoading(true);
      try {
        const getBlockedListRes = await getBlockedList();
        setBlockedList(getBlockedListRes.blockedUsers);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };
    fetchBlocks();
  }, []);

  const friendsListElements = blockedList.map((user) => (
    <RequestUserCard key={user._id} user={user} type="blocks" />
  ));
  return (
    <div className="flex flex-1">
      <div className="flex h-full w-5/12 flex-col border-e-2">
        <div className="flex items-center justify-between p-5">
          <h1>Blocked List</h1>
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
            <Alert className="bg-site-foreground">
              <LuCheck />
              <AlertTitle>You dont have any blocks</AlertTitle>
            </Alert>
          </div>
        ) : null}
      </div>
      <div className="flex w-7/12 items-center justify-center">a</div>
    </div>
  );
};

export default BlockedList;
