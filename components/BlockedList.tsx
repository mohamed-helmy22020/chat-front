import { useUserStore } from "@/store/userStore";
import { LuCheck } from "react-icons/lu";
import RequestUserCard from "./RequestUserCard";
import { Alert, AlertTitle } from "./ui/alert";

const BlockedList = () => {
  const blockedList = useUserStore((state) => state.blockedList);

  const friendsListElements = blockedList.map((user) => (
    <RequestUserCard key={user._id} user={user} type="blocks" />
  ));
  return (
    <div className="flex flex-1">
      <div className="flex h-full w-5/12 flex-col border-e-2">
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
      <div className="flex w-7/12 items-center justify-center">a</div>
    </div>
  );
};

export default BlockedList;
