import useAddFriend from "@/hooks/useAddFriend";
import useBlockUser from "@/hooks/useBlockUser";
import useUnBlockUser from "@/hooks/useUnBlockUser";
import useUnFriendUser from "@/hooks/useUnFriendUser";
import { deleteConversation as deleteConversationAction } from "@/lib/actions/user.actions";
import { useChatStore } from "@/store/chatStore";
import { useUserStore } from "@/store/userStore";
import { CgUnblock } from "react-icons/cg";
import { FaUserMinus, FaUserPlus } from "react-icons/fa6";
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
  const { currentUserId, blockedList, friendsList } = useUserStore(
    useShallow((state) => ({
      currentUserId: state.user?._id,
      friendsList: state.friendsList,
      blockedList: state.blockedList,
    })),
  );
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
  const otherSide = conversation?.participants.find(
    (p) => p._id !== currentUserId,
  );
  const isBlocked = blockedList.findIndex((f) => f._id === otherSide?._id) > -1;
  const isFriend = friendsList.findIndex((f) => f._id === otherSide?._id) > -1;
  const blockUser = useBlockUser();
  const { unblockUser } = useUnBlockUser();
  const { addFriend } = useAddFriend();
  const unFriendUser = useUnFriendUser();
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

        <DropdownMenuItem
          onClick={async () => {
            if (isBlocked) {
              toast.promise(unblockUser(otherSide!._id), {
                loading: "Unlocking...",
                success: () => {
                  return {
                    message: `User Unblocked`,
                  };
                },
                error: "Error",
              });
            } else {
              blockUser(otherSide!._id);
            }
          }}
        >
          {isBlocked ? <CgUnblock /> : <MdBlockFlipped />}
          {isBlocked ? "Unblock User" : "Block User"}
        </DropdownMenuItem>
        {!isBlocked && (
          <DropdownMenuItem
            onClick={async () => {
              if (isFriend) {
                unFriendUser(otherSide!._id);
              } else {
                addFriend(otherSide!._id);
              }
            }}
          >
            {isFriend ? <FaUserMinus /> : <FaUserPlus />}
            {isFriend ? "Unfriend User" : "Add Friend"}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={closeChat}>
          <IoMdClose />
          Close Chat
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ConversationMenu;
