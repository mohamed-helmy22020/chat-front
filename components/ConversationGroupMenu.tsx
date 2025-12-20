import {
  deleteConversation as deleteConversationAction,
  leaveGroup,
} from "@/lib/actions/user.actions";
import { useChatStore } from "@/store/chatStore";
import { useTranslations } from "next-intl";
import { IoMdClose } from "react-icons/io";
import { LuEllipsisVertical } from "react-icons/lu";
import { MdDelete, MdLogout, MdPersonAddAlt } from "react-icons/md";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
const ConversationGroupMenu = () => {
  const t = useTranslations("Chat.Conversation.Menu");
  const {
    currentConversation,
    changeCurrentConversation,
    deleteConversationFromState,
    changeInviteGroup,
  } = useChatStore(
    useShallow((state) => ({
      currentConversation: state.currentConversation,
      changeCurrentConversation: state.changeCurrentConversation,
      deleteConversationFromState: state.deleteConversation,
      changeInviteGroup: state.changeInviteGroup,
    })),
  );
  const deleteConversation = async () => {
    try {
      const toastId = toast.loading(t("DeletingConversation"));
      const deleteConversationRes = await deleteConversationAction(
        currentConversation?.id as string,
      );

      if (deleteConversationRes.success) {
        changeCurrentConversation(null);
        deleteConversationFromState(currentConversation?.id as string);
        toast.dismiss(toastId);
        toast.success(deleteConversationRes.msg);
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  const exitGroup = async () => {
    try {
      const toastId = toast.loading(t("ExitingGroup"));
      const exitGroupRes = await leaveGroup(currentConversation?.id as string);

      if (exitGroupRes.success) {
        changeCurrentConversation(null);
        deleteConversationFromState(currentConversation?.id as string, "exit");
        toast.dismiss(toastId);
        toast.success(exitGroupRes.msg);
      }
    } catch (error: any) {
      console.log(error);
    }
  };
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
        <DropdownMenuItem
          onClick={() => changeInviteGroup(currentConversation)}
        >
          <MdPersonAddAlt />
          {t("InviteFriend")}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={exitGroup}>
          <MdLogout />
          {t("ExitGroup")}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={deleteConversation}>
          <MdDelete />
          {t("DeleteChat")}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={closeChat}>
          <IoMdClose />
          {t("CloseChat")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ConversationGroupMenu;
