import {
  getGroupLinkToken,
  resetGroupLinkToken,
} from "@/lib/actions/user.actions";
import { useChatStore } from "@/store/chatStore";
import { useUserStore } from "@/store/userStore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GrPowerReset } from "react-icons/gr";
import { MdClose, MdOutlineContentCopy } from "react-icons/md";
import { RiLoader5Line } from "react-icons/ri";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

type Props = {
  closeMenu: () => void;
};

const InviteLinkMenu = ({ closeMenu }: Props) => {
  const currentUserId = useUserStore((state) => state.user?._id);
  const [isLoading, setIsLoading] = useState(true);
  const [linkToken, setLinkToken] = useState("");
  const group = useChatStore((state) => state.currentConversation);
  useEffect(() => {
    const getLinkToken = async () => {
      if (!group || group.type !== "group") return;
      try {
        const getLinkTokenRes = await getGroupLinkToken(group.id);
        if (!getLinkTokenRes.success) {
          throw new Error("Error getting link token");
        }
        setLinkToken(getLinkTokenRes.linkToken);
      } catch (error: any) {
        toast.error(error.meesage);
        closeMenu();
      }
      setIsLoading(false);
    };
    getLinkToken();
  }, [group, closeMenu]);

  if (!group || group.type !== "group") return null;
  const isAdmin = group.admin === currentUserId;
  const copyLink = () => {
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard");
  };
  const resetLink = async () => {
    setIsLoading(true);
    try {
      const getLinkTokenRes = await resetGroupLinkToken(group.id);
      if (!getLinkTokenRes.success) {
        throw new Error("Error resetting link token");
      }
      setLinkToken(getLinkTokenRes.linkToken);
    } catch (error: any) {
      toast.error(error.meesage);
    }
    setIsLoading(false);
  };

  if (isLoading)
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
          Invite to group via link
        </div>
        <div className="flex h-full w-full items-center justify-center px-3 py-2">
          <RiLoader5Line className="animate-spin" size={30} />
        </div>
      </div>
    );

  const link = `${window.location.href.split("?")[0]}?groupId=${encodeURIComponent(group.id)}&token=${encodeURIComponent(linkToken)}`;
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
        Invite to group via link
      </div>
      <div className="flex w-full flex-col items-center justify-center px-3 py-2">
        <div className="flex items-center px-5">
          <div className="relative flex h-10 min-w-10 items-center justify-center rounded-full">
            <Image
              className="rounded-full object-cover"
              src={group.groupImage || "/imgs/group.png"}
              alt="avatar"
              fill
            />
          </div>
          <div className="flex flex-col px-3">
            <p className="text-lg">{group.groupName}</p>
            <Link
              href={link}
              className="cursor-pointer text-xs text-wrap break-words break-all text-mainColor-600 hover:underline"
            >
              {link}
            </Link>
          </div>
        </div>
      </div>
      <div className="w-full px-3">
        <Separator />
      </div>
      <div className="w-full">
        <div
          className="flex cursor-pointer items-center gap-5 p-5 hover:bg-site-foreground"
          onClick={copyLink}
        >
          <MdOutlineContentCopy />
          <p>Copy Link</p>
        </div>
        {isAdmin && (
          <div
            className="flex cursor-pointer items-center gap-5 p-5 hover:bg-site-foreground"
            onClick={resetLink}
          >
            <GrPowerReset />
            <p>Reset Link</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InviteLinkMenu;
