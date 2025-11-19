import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RiUserShared2Line } from "react-icons/ri";

import { getSentRequests } from "@/lib/actions/user.actions";
import { useEffect, useState } from "react";
import { LuLoader } from "react-icons/lu";
import RequestUserCard from "./RequestUserCard";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const SentRequestsList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedUsers, setFetchedUsers] = useState<RequestUserType[]>([]);
  const fetchedUsersElements = fetchedUsers.map((user) => (
    <RequestUserCard user={user} type="sent" key={user._id} />
  ));

  useEffect(() => {
    const fetchSentRequests = async () => {
      setIsLoading(true);
      try {
        const sentRequestsRes = await getSentRequests();
        if (!sentRequestsRes.success) {
          throw new Error(sentRequestsRes.msg);
        }
        setFetchedUsers(sentRequestsRes.sentRequests);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };

    if (isOpen) {
      fetchSentRequests();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="cursor-pointer" variant="ghostFull">
                <RiUserShared2Line />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="rounded-full"
              sideOffset={0}
            >
              <p>Sent Requests</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-auto sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sent Requests</DialogTitle>
          <DialogDescription>The user requests you have sent</DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="flex items-center justify-center p-5">
            <LuLoader className="animate-spin" />
          </div>
        ) : fetchedUsersElements.length > 0 ? (
          <div className="flex flex-col">{fetchedUsersElements}</div>
        ) : (
          <div className="flex items-center justify-center p-5">
            No Sent Requests
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SentRequestsList;
