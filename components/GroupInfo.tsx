import { useChatStore } from "@/store/chatStore";
import Image from "next/image";
import { MdClose, MdPersonAddAlt } from "react-icons/md";
import RequestUserCard from "./RequestUserCard";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

const GroupInfo = () => {
  const group = useChatStore((state) => state.currentConversation);

  const changeItemInfo = useChatStore((state) => state.changeInfoItem);
  const changeInviteGroup = useChatStore((state) => state.changeInviteGroup);
  if (!group) return null;
  return (
    <div className="flex max-h-svh w-full flex-col items-center gap-3 overflow-y-auto">
      <div className="flex w-full items-center px-3 py-1 select-none">
        <Button
          variant="ghostFull"
          className="me-3 scale-125 cursor-pointer p-2!"
          onClick={() => changeItemInfo(null)}
        >
          <MdClose />
        </Button>
        Group Info
      </div>
      <div className="relative flex min-h-20 min-w-20 items-center justify-center rounded-full">
        <Image
          className="rounded-full object-cover"
          src={group.groupImage || "/imgs/group.png"}
          alt="avatar"
          fill
        />
      </div>
      <div className="text-xl">{group.groupName}</div>
      <div className="text-gray-400">
        Group . {group.participants.length} members
      </div>
      <div>
        <Button
          variant="ghostFull"
          className="flex cursor-pointer flex-col border-2 px-12 py-2 hover:bg-site-foreground"
          onClick={() => changeInviteGroup(group)}
        >
          <MdPersonAddAlt /> Add
        </Button>
      </div>
      <div className="w-full p-2">{group.desc}</div>
      <div className="w-full p-3 md:w-2/3 lg:w-1/2">
        <Separator />
      </div>
      <div className="flex w-full flex-col gap-2 p-2">
        <div className="flex cursor-pointer items-center justify-between gap-2 text-gray-400">
          <h2>{group.participants.length} members</h2>
        </div>
        <div>
          {group.participants.map((p) => (
            <RequestUserCard
              key={p._id}
              user={p}
              type="groupMember"
              extra={{
                isGroupAdmin: group.admin === p._id,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupInfo;
