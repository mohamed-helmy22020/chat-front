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

import { useUserStore } from "@/store/userStore";
import { useState } from "react";
import RequestUserCard from "./RequestUserCard";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const ReceivedRequestsList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const receivedRequestsList = useUserStore(
    (state) => state.receivedRequestsList,
  );
  const fetchedUsersElements = receivedRequestsList.map((user) => (
    <RequestUserCard user={user} type="request" key={user._id} />
  ));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="cursor-pointer" variant="ghostFull">
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
      <DialogContent className="max-h-svh overflow-auto sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Friends Requests</DialogTitle>
          <DialogDescription>
            The friends requests that have sent to you
          </DialogDescription>
        </DialogHeader>
        {fetchedUsersElements.length > 0 ? (
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
