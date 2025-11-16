import { useChatStore } from "@/store/chatStore";
import { LuEllipsisVertical } from "react-icons/lu";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const ConversationMenu = () => {
  const changeCurrentConversation = useChatStore(
    (state) => state.changeCurrentConversation,
  );
  const closeChat = () => {
    changeCurrentConversation(null);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="cursor-pointer rounded-full p-2 hover:bg-gray-100 dark:hover:bg-slate-700"
          variant="ghostFull"
        >
          <LuEllipsisVertical className="h-5 w-5 text-slate-500 dark:text-slate-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={closeChat}>Close Chat</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ConversationMenu;
