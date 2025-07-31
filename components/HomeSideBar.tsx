"use client";
import { cn } from "@/lib/utils";
import {
  LuCircleDotDashed,
  LuMessageSquareText,
  LuSettings,
  LuUser,
  LuUserRoundX,
  LuUsers,
} from "react-icons/lu";

import { PageType, usePageStore } from "@/store/pageStore";
import { useUserStore } from "@/store/userStore";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { Separator } from "./ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
type Props = {
  userProp?: UserType;
};
const HomeSideBar = ({ userProp }: Props) => {
  const changeUserData = useUserStore((state) => state.changeUserData);
  useEffect(() => {
    if (userProp) {
      changeUserData(userProp);
    }
  }, [userProp, changeUserData]);
  return (
    <div className="flex flex-col overflow-hidden bg-site-foreground px-2 py-3.5">
      <div className="flex flex-col items-center justify-center">
        <SideBarButton Icon={LuMessageSquareText} page="chat" />
        <SideBarButton Icon={LuCircleDotDashed} page="status" />
        <SideBarButton Icon={LuUsers} page="friends" />
        <SideBarButton Icon={LuUserRoundX} page="blocks" />
      </div>
      <div className="flex-1">
        <Separator />
      </div>
      <div className="flex flex-col">
        <SideBarButton Icon={LuSettings} page="settings" />
        <SideBarButton Icon={LuUser} page="profile" />
      </div>
    </div>
  );
};

const SideBarButton = ({
  Icon,
  page,
}: {
  Icon: React.ComponentType<{ size?: number }>;
  page: PageType;
}) => {
  const { currentPage, setPage } = usePageStore(
    useShallow((state) => ({
      currentPage: state.page,
      setPage: state.setPage,
    })),
  );
  const isActive = page === currentPage;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className={cn(
            "mb-2 cursor-pointer rounded-full p-2 text-gray-400 hover:bg-site-background",
            {
              "text-white": isActive,
              "bg-site-background": isActive,
            },
          )}
          onClick={() => setPage(page)}
        >
          <Icon size={24} />
        </button>
      </TooltipTrigger>
      <TooltipContent className="rounded-full" side="left" sideOffset={5}>
        <p className="capitalize select-none">{page}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default HomeSideBar;
