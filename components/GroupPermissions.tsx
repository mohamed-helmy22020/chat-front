import { updateGroupSettings } from "@/lib/actions/user.actions";
import { setNestedValue } from "@/lib/utils";
import { useChatStore } from "@/store/chatStore";
import { useState } from "react";
import { GoPencil } from "react-icons/go";
import { HiOutlineUserAdd } from "react-icons/hi";
import { IoLink } from "react-icons/io5";
import { LuMessageSquareText } from "react-icons/lu";
import { MdClose } from "react-icons/md";
import { RiUserSettingsLine } from "react-icons/ri";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";

type Props = {
  closeMenu: () => void;
};

const GroupPermissions = ({ closeMenu }: Props) => {
  const group = useChatStore((state) => state.currentConversation);
  const defaultSettings: GroupSettingsType = {
    members: {
      editGroupData: true,
      sendNewMessages: true,
      addOtherMembers: false,
      inviteViaLink: false,
    },
    admin: {
      approveNewMembers: false,
    },
    linkToken: null,
  };
  const [settings, setSettings] = useState<GroupSettingsType>(
    group?.type === "group" ? group.groupSettings : defaultSettings,
  );
  if (!group || group.type !== "group") return null;

  const updateSettings = async (name: string, value: boolean) => {
    const names = name.split(".");
    const newSettings = setNestedValue(settings, names, value);
    setSettings(newSettings);

    try {
      const updateSettingsRes = await updateGroupSettings(
        group.id,
        newSettings,
      );
      if (!updateSettingsRes.success) {
        setSettings(settings);
        throw new Error("Failed to update group settings");
      }
    } catch (error: any) {
      toast.error(error.msg || error.message);
    }
  };
  return (
    <div className="flex max-h-svh w-full flex-col items-center gap-3 overflow-y-auto">
      <div className="flex w-full items-center border-b px-3 py-3 select-none">
        <Button
          variant="ghostFull"
          className="me-3 scale-125 cursor-pointer p-2!"
          onClick={closeMenu}
        >
          <MdClose />
        </Button>
        Group Permissions
      </div>
      <div className="flex w-full flex-col px-3 py-2">
        <p className="px-2 text-gray-500">Members can:</p>
        <Item
          title="Edit group settings"
          desc="This includes the name, icon, description"
          checked={settings.members.editGroupData}
          name="members.editGroupData"
          onChange={updateSettings}
        >
          <GoPencil />
        </Item>
        <Item
          title="Send new messages"
          checked={settings.members.sendNewMessages}
          name="members.sendNewMessages"
          onChange={updateSettings}
        >
          <LuMessageSquareText />
        </Item>
        <Item
          title="Add other members"
          checked={settings.members.addOtherMembers}
          name="members.addOtherMembers"
          onChange={updateSettings}
        >
          <HiOutlineUserAdd />
        </Item>
        <Item
          title="Invite via link"
          checked={settings.members.inviteViaLink}
          name="members.inviteViaLink"
          onChange={updateSettings}
        >
          <IoLink />
        </Item>
      </div>
      <div className="flex w-full flex-col px-3 py-2">
        <p className="px-2 text-gray-500">Admins can:</p>
        <Item
          title="Approve new members"
          desc="When turned on, admins must approve anyone who wants to join this group"
          checked={settings.admin.approveNewMembers}
          name="admin.approveNewMembers"
          onChange={updateSettings}
        >
          <RiUserSettingsLine />
        </Item>
      </div>
    </div>
  );
};

const Item = ({
  children,
  title,
  desc,
  checked,
  name,
  onChange,
}: {
  children?: React.ReactNode;
  title: string;
  desc?: string;
  checked: boolean;
  name: string;
  onChange: (name: string, value: boolean) => void;
}) => {
  return (
    <div className="flex items-center gap-5 rounded-sm p-5 hover:bg-site-foreground">
      <div className="">{children}</div>
      <div className="flex-1">
        <p className="font-bold text-gray-300">{title}</p>
        {desc && <p className="mt-1 text-sm text-gray-500">{desc}</p>}
      </div>
      <div>
        <Checkbox
          checked={checked}
          name={name}
          onCheckedChange={(value) => onChange(name, !!value)}
        />
      </div>
    </div>
  );
};

export default GroupPermissions;
