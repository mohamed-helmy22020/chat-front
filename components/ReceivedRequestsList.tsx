import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RiUserReceived2Line } from "react-icons/ri";

import { getFriendsRequests } from "@/lib/actions/user.actions";
import { useEffect, useState } from "react";
import { LuLoader } from "react-icons/lu";
import RequestUserCard from "./RequestUserCard";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const ReceivedRequestsList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedUsers, setFetchedUsers] = useState<RequestUserType[]>([]);
  const fetchedUsersElements = fetchedUsers.map((user) => (
    <RequestUserCard user={user} type="request" key={user._id} />
  ));

  useEffect(() => {
    console.log("ewfwsqsq3143124ef");
    const fetchFriendsRequests = async () => {
      setIsLoading(true);
      try {
        const friendsRequestsRes = await getFriendsRequests();
        if (!friendsRequestsRes.success) {
          throw new Error(friendsRequestsRes.msg);
        }
        console.log({ friendsRequestsRes });
        setFetchedUsers(friendsRequestsRes.friendRequests);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };
    if (isOpen) {
      fetchFriendsRequests();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="" variant="ghostFull">
                <RiUserReceived2Line />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="rounded-full"
              sideOffset={0}
            >
              <p>Friends Requests</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-auto sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Friends Requests</DialogTitle>
          <DialogDescription>
            The friends requests that have sent to you
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="flex items-center justify-center p-5">
            <LuLoader className="animate-spin" />
          </div>
        ) : fetchedUsersElements.length > 0 ? (
          <div className="flex flex-col">{fetchedUsersElements}</div>
        ) : (
          <div className="flex items-center justify-center p-5">
            No Friends Requests
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReceivedRequestsList;
