import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { joinGroup } from "@/lib/actions/user.actions";
import { kFormatter } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import { RiLoader5Line } from "react-icons/ri";
import { Button } from "./ui/button";
type Props = {
  group: ConversationType | null;
  setJoinGroup: (group: ConversationType | null) => void;
};

const JoinGroupDialog = ({ group, setJoinGroup }: Props) => {
  const [open, setOpen] = useState(true);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    if (!open) {
      setJoinGroup(null);
    }
  }, [open, setJoinGroup]);
  useEffect(() => {
    if (!group) {
      setOpen(true);
    }
  }, [group]);
  if (!group || group.type !== "group") return null;
  const handleJoin = async () => {
    setIsJoining(true);
    console.log(group.groupSettings.linkToken);
    if (!group.groupSettings.linkToken) return;
    try {
      const res = await joinGroup(group.id, group.groupSettings.linkToken);
      console.log({ res });
      if (!res.success) {
        throw new Error(res.msg);
      }
      setOpen(false);
    } catch (error: any) {
      console.log(error);
    }
    setIsJoining(false);
  };
  return (
    <Dialog open={open && !!group} onOpenChange={setOpen}>
      <DialogContent aria-describedby="Join Group">
        <DialogHeader>
          <DialogTitle>Join Group</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center">
          <div className="relative flex h-25 min-w-25 items-center justify-center rounded-full">
            <Image
              className="rounded-full object-cover"
              src={group.groupImage || "/imgs/group.png"}
              alt="avatar"
              fill
            />
          </div>
          <div className="flex flex-col items-center justify-center pt-3">
            <p className="text-lg text-gray-300">{group.groupName}</p>

            <p className="text-gray-500">
              Created On {new Date(group.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex py-5">
            <div className="relative flex h-10 min-w-10 items-center justify-center rounded-full">
              <Image
                className="rounded-full object-cover"
                src={
                  (group.admin as never as participant).userProfileImage ||
                  "/imgs/group.png"
                }
                alt="avatar"
                fill
              />
            </div>
            {group.participants.length - 1 > 0 && (
              <div className="z-10 -ms-3 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-site-foreground text-xs select-none">
                +{kFormatter(group.participants.length - 1)}
              </div>
            )}
          </div>
          <div className="truncate text-lg text-gray-400">{group.desc}</div>
          <div className="mt-2 flex w-full gap-1 px-10">
            <Button
              variant="ghostFull"
              className="!w-1/2 cursor-pointer rounded-full text-mainColor-600 duration-100 hover:bg-mainColor-600/10"
              onClick={() => {
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="ghostFull"
              className="!w-1/2 cursor-pointer rounded-full bg-mainColor-600"
              onClick={handleJoin}
              disabled={isJoining}
            >
              {isJoining ? <RiLoader5Line className="animate-spin" /> : "Join"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinGroupDialog;
