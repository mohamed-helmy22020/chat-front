import { useChatStore } from "@/store/chatStore";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { MdOutlineGroups } from "react-icons/md";
import ConversationItem from "./ConversationItem";
import NewGroupMenu from "./NewGroupMenu";
import PageAbout from "./PageAbout";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const Groups = () => {
  const t = useTranslations("Groups");
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const groups = useChatStore((state) => state.conversations).filter(
    (c) => c.type === "group",
  );

  const groupsElements = groups.map((g) => (
    <ConversationItem key={g.id} conversation={g} />
  ));
  return (
    <div className="flex flex-1">
      {showCreateGroup ? (
        <NewGroupMenu setShowCreateGroup={setShowCreateGroup} />
      ) : (
        <div className="flex h-full w-full flex-col border-e-2 md:w-5/12">
          <div className="flex items-center justify-between p-5">
            <h1>{t("Groups")}</h1>
            <div className="flex">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="cursor-pointer"
                    variant="ghostFull"
                    onClick={() => setShowCreateGroup(true)}
                  >
                    <CiCirclePlus />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="rounded-full"
                  sideOffset={0}
                >
                  <p>{t("CreateGroup")}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <div className="flex flex-col gap-2 px-3">{groupsElements}</div>
        </div>
      )}
      <PageAbout title={t("CreateGroup")} about1={t("About1")}>
        <MdOutlineGroups size={100} />
      </PageAbout>
    </div>
  );
};

export default Groups;
