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

import { useUserStore } from "@/store/userStore";
import { useState } from "react";
import RequestUserCard from "./RequestUserCard";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const SentRequestsList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sentRequestsList = useUserStore((state) => state.sentRequestsList);
  const fetchedUsersElements = sentRequestsList.map((user) => (
    <RequestUserCard user={user} type="sent" key={user._id} />
  ));

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
      <DialogContent className="max-h-svh overflow-auto sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sent Requests</DialogTitle>
          <DialogDescription>The user requests you have sent</DialogDescription>
        </DialogHeader>
        {fetchedUsersElements.length > 0 ? (
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
