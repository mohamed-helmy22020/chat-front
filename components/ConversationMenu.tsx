import useAddFriend from "@/hooks/useAddFriend";
import useBlockUser from "@/hooks/useBlockUser";
import useCancelSentRequest from "@/hooks/useCancelSentRequest";
import useHandleFriendRequest from "@/hooks/useHandleFriendRequest";
import useUnBlockUser from "@/hooks/useUnBlockUser";
import useUnFriendUser from "@/hooks/useUnFriendUser";
import { deleteConversation as deleteConversationAction } from "@/lib/actions/user.actions";
import { useChatStore } from "@/store/chatStore";
import { useUserStore } from "@/store/userStore";
import { useTranslations } from "next-intl";
import { CgUnblock } from "react-icons/cg";
import { FaUserMinus, FaUserPlus } from "react-icons/fa6";
import { IoMdClose, IoMdInformationCircleOutline } from "react-icons/io";
import { LuCheck, LuEllipsisVertical, LuUserX, LuX } from "react-icons/lu";
import { MdBlockFlipped, MdDelete } from "react-icons/md";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const ConversationMenu = () => {
  const t = useTranslations("Chat.Conversation.Menu");
  const {
    currentUserId,
    blockedList,
    friendsList,
    receivedRequestsList,
    sentRequestsList,
  } = useUserStore(
    useShallow((state) => ({
      currentUserId: state.user?._id,
      friendsList: state.friendsList,
      blockedList: state.blockedList,
      sentRequestsList: state.sentRequestsList,
      receivedRequestsList: state.receivedRequestsList,
    })),
  );
  const {
    changeCurrentConversation,
    conversation,
    deleteConversationFromState,
    changeInfoItem,
  } = useChatStore(
    useShallow((state) => ({
      changeCurrentConversation: state.changeCurrentConversation,
      conversation: state.currentConversation,
      deleteConversationFromState: state.deleteConversation,
      changeInfoItem: state.changeInfoItem,
    })),
  );
  const otherSide = conversation?.participants.find(
    (p) => p._id !== currentUserId,
  );
  const isBlocked = blockedList.findIndex((f) => f._id === otherSide?._id) > -1;
  const isFriend = friendsList.findIndex((f) => f._id === otherSide?._id) > -1;
  const isSentRequest =
    sentRequestsList.findIndex((f) => f._id === otherSide?._id) > -1;
  const isReceivedRequest =
    receivedRequestsList.findIndex((f) => f._id === otherSide?._id) > -1;

  const blockUser = useBlockUser();
  const { unblockUser } = useUnBlockUser();
  const { addFriend } = useAddFriend();
  const unFriendUser = useUnFriendUser();
  const { cancelSentRequest } = useCancelSentRequest();
  const { handleFriendRequest } = useHandleFriendRequest();
  const closeChat = () => {
    changeCurrentConversation(null);
  };
  const deleteConversation = async () => {
    try {
      const toastId = toast.loading(t("DeletingConversation"));
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
        <DropdownMenuItem
          onClick={async () => {
            if (isBlocked) {
              toast.promise(unblockUser(otherSide!._id), {
                loading: t("Unblocking"),
                success: () => {
                  return {
                    message: t("UserUnblocked"),
                  };
                },
                error: t("Error"),
              });
            } else {
              blockUser(otherSide!._id);
            }
          }}
        >
          {isBlocked ? <CgUnblock /> : <MdBlockFlipped />}
          {isBlocked ? t("UnblockUser") : t("BlockUser")}
        </DropdownMenuItem>
        {!isBlocked && !isSentRequest && !isReceivedRequest && (
          <DropdownMenuItem
            onClick={async () => {
              if (isFriend) {
                toast.promise(unFriendUser(otherSide!._id), {
                  loading: t("Unfriending"),
                  success: () => {
                    return {
                      message: t("UserNoLongerFriend"),
                    };
                  },
                  error: t("Error"),
                });
              } else {
                toast.promise(addFriend(otherSide!._id), {
                  loading: t("SendingFriendRequest"),
                  success: () => {
                    return {
                      message: t("FriendRequestSent"),
                    };
                  },
                  error: t("Error"),
                });
              }
            }}
          >
            {isFriend ? <FaUserMinus /> : <FaUserPlus />}
            {isFriend ? t("UnfriendUser") : t("AddFriend")}
          </DropdownMenuItem>
        )}
        {isSentRequest && (
          <DropdownMenuItem
            onClick={async () => {
              toast.promise(cancelSentRequest(otherSide!._id), {
                loading: t("CancellingSentRequest"),
                success: () => {
                  return {
                    message: t("RequestCancelled"),
                  };
                },
                error: t("Error"),
              });
            }}
          >
            <LuUserX />
            {t("CancelSentRequest")}
          </DropdownMenuItem>
        )}
        {isReceivedRequest && (
          <>
            <DropdownMenuItem
              onClick={async () => {
                toast.promise(
                  handleFriendRequest(otherSide!._id, "accept-request"),
                  {
                    loading: t("AcceptingFriendRequest"),
                    success: () => {
                      return {
                        message: t("UserIsFriend"),
                      };
                    },
                    error: t("Error"),
                  },
                );
              }}
            >
              <LuCheck />
              {t("AcceptFriendRequest")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                toast.promise(
                  handleFriendRequest(otherSide!._id, "cancel-request"),
                  {
                    loading: t("RejectingFriendRequest"),
                    success: () => {
                      return {
                        message: t("UserIsCancelled"),
                      };
                    },
                    error: t("Error"),
                  },
                );
              }}
            >
              <LuX />
              {t("RejectFriendRequest")}
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuItem onClick={closeChat}>
          <IoMdClose />
          {t("CloseChat")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={deleteConversation}>
          <MdDelete />
          {t("DeleteChat")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            changeInfoItem(conversation);
          }}
        >
          <IoMdInformationCircleOutline /> {t("ChatInfo")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ConversationMenu;
