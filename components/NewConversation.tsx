import { Button } from "@/components/ui/button";

import { useTranslations } from "next-intl";
import { CiCirclePlus } from "react-icons/ci";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
  setIsNewConversationOpen: (value: boolean) => void;
};

const NewConversation = ({ setIsNewConversationOpen }: Props) => {
  const t = useTranslations("Chat.ConversationsList");
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
            <p>{t("NewChat")}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </>
  );
};

export default NewConversation;
