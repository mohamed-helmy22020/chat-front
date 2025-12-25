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
import { useTranslations } from "next-intl";
import { useState } from "react";
import RequestUserCard from "./RequestUserCard";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const SentRequestsList = () => {
  const t = useTranslations("Friends.SentRequests");
  const [isOpen, setIsOpen] = useState(false);
  const sentRequestsList = useUserStore((state) => state.sentRequestsList);
  console.log({ sentRequestsList });
  const fetchedUsersElements = sentRequestsList.map((user) => (
    <RequestUserCard user={user} type="sent" key={user._id} />
  ));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="relative cursor-pointer gap-1"
                variant="ghostFull"
              >
                {sentRequestsList.length > 0 && (
                  <p className="text-xs text-mainColor-600">
                    {sentRequestsList.length > 99
                      ? "99+"
                      : sentRequestsList.length}
                  </p>
                )}
                <RiUserShared2Line />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="rounded-full"
              sideOffset={0}
            >
              <p>{t("SentRequests")}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </DialogTrigger>
      <DialogContent className="max-h-svh overflow-auto sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("SentRequests")}</DialogTitle>
          <DialogDescription>{t("desc")}</DialogDescription>
        </DialogHeader>
        {fetchedUsersElements.length > 0 ? (
          <div className="flex flex-col">{fetchedUsersElements}</div>
        ) : (
          <div className="flex items-center justify-center p-5">
            {t("NoSentRequests")}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SentRequestsList;
