import { useChatStore } from "@/store/chatStore";
import { useUserStore } from "@/store/userStore";
import Image from "next/image";
import { useState } from "react";
import { HiOutlineUserAdd } from "react-icons/hi";
import { IoIosSettings } from "react-icons/io";
import { IoLink } from "react-icons/io5";
import { MdClose, MdPersonAddAlt } from "react-icons/md";
import { useShallow } from "zustand/react/shallow";
import GroupDescUpdate from "./GroupDescUpdate";
import GroupNameUpdate from "./GroupNameUpdate";
import GroupPermissions from "./GroupPermissions";
import GroupPictureUpdate from "./GroupPictureUpdate";
import InviteLinkMenu from "./InviteLinkMenu";
import RequestUserCard from "./RequestUserCard";
import SettingsCard from "./SettingsCard";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

const GroupInfo = () => {
  const [subMenu, setSubMenu] = useState("");
  const userId = useUserStore((state) => state.user?._id);
  const { group, changeInfoItem, changeInviteGroup } = useChatStore(
    useShallow((state) => ({
      group: state.currentConversation,
      changeInfoItem: state.changeInfoItem,
      changeInviteGroup: state.changeInviteGroup,
    })),
  );

  if (!group || group.type !== "group") return null;

  const isAdmin = group?.type === "group" && group.admin === userId;

  const canAddOtherUsers =
    isAdmin || group.groupSettings.members.addOtherMembers;

  const canInviteViaLink = isAdmin || group.groupSettings.members.inviteViaLink;

  const canUpdateGroupData =
    isAdmin || group.groupSettings.members.editGroupData;
  if (subMenu === "permission" && isAdmin) {
    return <GroupPermissions closeMenu={() => setSubMenu("")} />;
  }
  if (subMenu === "inviteLink" && canInviteViaLink) {
    return <InviteLinkMenu closeMenu={() => setSubMenu("")} />;
  }

  return (
    <div className="flex max-h-svh w-full flex-col items-center gap-3 overflow-hidden overflow-y-auto">
      <div className="flex w-full items-center border-b px-3 py-3 select-none">
        <Button
          variant="ghostFull"
          className="me-3 scale-125 cursor-pointer p-2!"
          onClick={() => changeInfoItem(null)}
        >
          <MdClose />
        </Button>
        Group Info
      </div>
      {canUpdateGroupData ? (
        <GroupPictureUpdate />
      ) : (
        <div className="relative flex min-h-32 min-w-32 items-center justify-center rounded-full">
          <Image
            className="rounded-full object-cover"
            src={group.groupImage || "/imgs/group.png"}
            alt="avatar"
            fill
          />
        </div>
      )}

      <div className="w-full px-3">
        <GroupNameUpdate />
      </div>
      <div className="text-gray-400">
        Group . {group.participants.length} members
      </div>
      <div>
        {canAddOtherUsers && (
          <Button
            variant="ghostFull"
            className="flex cursor-pointer flex-col border-2 px-12 py-2 hover:bg-site-foreground"
            onClick={() => changeInviteGroup(group)}
          >
            <MdPersonAddAlt /> Add
          </Button>
        )}
      </div>
      <div className="w-full p-2">
        <GroupDescUpdate />
      </div>
      {isAdmin && (
        <>
          <div className="w-full p-3 md:w-2/3 lg:w-1/2">
            <Separator />
          </div>
          <div className="w-full">
            <SettingsCard
              animationDelay={0}
              title={`Group Permissions`}
              onClick={() => setSubMenu("permission")}
            >
              <IoIosSettings size={25} color="#6a7282" />
            </SettingsCard>
          </div>
          <div className="w-full p-3 pt-0 md:w-2/3 lg:w-1/2">
            <Separator />
          </div>
        </>
      )}
      <div className="flex w-full flex-col gap-2 p-2">
        <div className="flex cursor-pointer items-center justify-between gap-2 text-gray-400">
          <h2>{group.participants.length} members</h2>
        </div>
        <div>
          {canAddOtherUsers && (
            <SettingsCard
              animationDelay={0}
              title={`Add Member`}
              onClick={() => changeInviteGroup(group)}
            >
              <HiOutlineUserAdd size={25} color="#6a7282" />
            </SettingsCard>
          )}
          {canInviteViaLink && (
            <SettingsCard
              animationDelay={0}
              title={`Invite to group via link`}
              onClick={() => {
                setSubMenu("inviteLink");
              }}
            >
              <IoLink size={25} color="#6a7282" />
            </SettingsCard>
          )}
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
