import { Button } from "@/components/ui/button";

import { CiCirclePlus } from "react-icons/ci";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
  setIsNewConversationOpen: (value: boolean) => void;
};

const NewConversation = ({ setIsNewConversationOpen }: Props) => {
  return (
    <>
      <div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="cursor-pointer"
              variant="ghostFull"
              onClick={() => setIsNewConversationOpen(true)}
            >
              <CiCirclePlus />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="rounded-full" sideOffset={0}>
            <p>New Chat</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </>
  );
};

export default NewConversation;
