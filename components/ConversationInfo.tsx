import useBlockUser from "@/hooks/useBlockUser";
import { deleteConversation as deleteConversationAction } from "@/lib/actions/user.actions";
import { useChatStore } from "@/store/chatStore";
import { useUserStore } from "@/store/userStore";
import Image from "next/image";
import { LuPhone, LuVideo } from "react-icons/lu";
import { MdBlockFlipped, MdClose, MdDelete } from "react-icons/md";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import GroupInfo from "./GroupInfo";
import SettingsCard from "./SettingsCard";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
const ConversationInfo = () => {
  const currentUserId = useUserStore((state) => state.user?._id);
  const {
    infoItem,
    currentConversation,
    deleteConversationFromState,
    changeCurrentConversation,
  } = useChatStore(
    useShallow((state) => ({
      infoItem: state.infoItem as ConversationType,
      currentConversation: state.currentConversation,
      changeCurrentConversation: state.changeCurrentConversation,
      deleteConversationFromState: state.deleteConversation,
    })),
  );
  const changeInfoItem = useChatStore((state) => state.changeInfoItem);
  const blockUser = useBlockUser();
  const deleteConversation = async () => {
    try {
      const toastId = toast.loading("Deleting Conversation...");
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
  if (infoItem.groupName) {
    return <GroupInfo />;
  }
  const otherSide = currentConversation?.participants.find(
    (u) => u._id !== currentUserId,
  );
  return (
    <div className="flex max-h-svh w-full flex-col items-center gap-3 overflow-y-auto">
      <div className="flex w-full items-center px-3 py-1 select-none">
        <Button
          variant="ghostFull"
          className="me-3 scale-125 cursor-pointer p-2!"
          onClick={() => changeInfoItem(null)}
        >
          <MdClose />
        </Button>
        Chat Info
      </div>
      <div className="relative flex min-h-20 min-w-20 items-center justify-center rounded-full">
        <Image
          className="rounded-full object-cover"
          src={otherSide?.userProfileImage || "/imgs/user.png"}
          alt="avatar"
          fill
        />
      </div>
      <div className="text-xl">{otherSide?.name}</div>
      <div className="text-gray-400">{otherSide?.email}</div>
      <div className="flex gap-2">
        <Button
          variant="ghostFull"
          className="flex cursor-pointer flex-col border-2 px-10 py-2 hover:bg-site-foreground"
        >
          <LuPhone /> Voice Call
        </Button>

        <Button
          variant="ghostFull"
          className="flex cursor-pointer flex-col border-2 px-10 py-2 hover:bg-site-foreground"
        >
          <LuVideo /> Video Call
        </Button>
      </div>
      <div className="w-full p-2">
        <div className="text-gray-400">About</div>
        <div className="line-clamp-2">{otherSide?.bio}</div>
      </div>
      <div className="w-full p-3 md:w-2/3 lg:w-1/2">
        <Separator />
      </div>
      <div className="w-full">
        <SettingsCard
          animationDelay={0.1}
          title={`Block ${otherSide?.name}`}
          color="#cf3a3a"
          onClick={async () => {
            blockUser(otherSide!._id);
          }}
        >
          <MdBlockFlipped size={25} />
        </SettingsCard>
        <SettingsCard
          animationDelay={0.2}
          title={`Clear Chat`}
          color="#cf3a3a"
          onClick={deleteConversation}
        >
          <MdDelete size={25} />
        </SettingsCard>
      </div>
    </div>
  );
};

export default ConversationInfo;
