import { deleteConversation as deleteConversationAction } from "@/lib/actions/user.actions";
import { useChatStore } from "@/store/chatStore";
import { IoMdClose } from "react-icons/io";
import { LuEllipsisVertical } from "react-icons/lu";
import { MdBlockFlipped, MdDelete } from "react-icons/md";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const ConversationMenu = () => {
  const {
    changeCurrentConversation,
    conversation,
    deleteConversationFromState,
  } = useChatStore(
    useShallow((state) => ({
      changeCurrentConversation: state.changeCurrentConversation,
      conversation: state.currentConversation,
      deleteConversationFromState: state.deleteConversation,
    })),
  );
  const closeChat = () => {
    changeCurrentConversation(null);
  };
  const deleteConversation = async () => {
    try {
      const toastId = toast.loading("Deleting Conversation...");
      const deleteConversationRes = await deleteConversationAction(
        conversation?.id as string,
      );

      if (deleteConversationRes.success) {
        changeCurrentConversation(null);
        deleteConversationFromState(conversation?.id as string);
        toast.dismiss(toastId);
        toast.success(deleteConversationRes.msg);
      }
    } catch (error: any) {
      console.log(error);
    }
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
        <DropdownMenuItem onClick={deleteConversation}>
          <MdDelete />
          Delete Chat
        </DropdownMenuItem>

        <DropdownMenuItem>
          <MdBlockFlipped />
          Block User
        </DropdownMenuItem>
        <DropdownMenuItem onClick={closeChat}>
          <IoMdClose />
          Close Chat
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ConversationMenu;
