import { cn } from "@/lib/utils";
import {
  CircleDotDashed,
  MessageSquareText,
  Settings,
  User,
  UserRoundX,
  Users,
} from "lucide-react";
import { Separator } from "./ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
  page: string;
  setPage: React.Dispatch<React.SetStateAction<string>>;
};

const HomeSideBar = ({ page, setPage }: Props) => {
  return (
    <div className="flex flex-col overflow-hidden bg-site-foreground px-2 py-3.5">
      <div className="flex flex-col items-center justify-center">
        <SideBarButton
          setPage={setPage}
          Icon={MessageSquareText}
          page="chat"
          currentPage={page}
        />
        <SideBarButton
          setPage={setPage}
          Icon={CircleDotDashed}
          page="status"
          currentPage={page}
        />
        <SideBarButton
          setPage={setPage}
          Icon={Users}
          page="friends"
          currentPage={page}
        />
        <SideBarButton
          setPage={setPage}
          Icon={UserRoundX}
          page="blocks"
          currentPage={page}
        />
      </div>
      <div className="flex-1">
        <Separator />
      </div>
      <div className="flex flex-col">
        <SideBarButton
          setPage={setPage}
          Icon={Settings}
          page="settings"
          currentPage={page}
        />
        <SideBarButton
          setPage={setPage}
          Icon={User}
          page="profile"
          currentPage={page}
        />
      </div>
    </div>
  );
};

const SideBarButton = ({
  setPage,
  Icon,
  page,
  currentPage,
}: {
  setPage: React.Dispatch<React.SetStateAction<string>>;
  Icon: React.ComponentType<{ size?: number }>;
  page: string;
  currentPage: string;
}) => {
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
      <TooltipContent
        className="rounded-full"
        side="left"
        onPointerDownOutside={(e) => e.preventDefault()}
        sideOffset={5}
      >
        <p className="capitalize select-none">{page}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default HomeSideBar;
