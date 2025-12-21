import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useChatStore } from "@/store/chatStore";
import { useUserStore } from "@/store/userStore";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import RequestUserCard from "./RequestUserCard";
import { Input } from "./ui/input";

const InviteMenu = () => {
  const t = useTranslations("Chat.Conversation.ForwardMenu");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const friendsList = useUserStore((state) => state.friendsList);

  const { isInviting, changeInviteGroup, inviteGroup } = useChatStore(
    useShallow((state) => ({
      isInviting: state.isInviting,
      changeInviteGroup: state.changeInviteGroup,
      inviteGroup: state.inviteGroup,
    })),
  );

  useEffect(() => {
    setOpen(isInviting);
  }, [isInviting]);

  const friendsListElements = friendsList
    .filter(
      (u) =>
        u?.name.includes(search) &&
        !inviteGroup?.participants.find((p) => p._id === u._id),
    )
    .map((friend) => (
      <RequestUserCard key={friend._id} user={friend} type="inviteGroup" />
    ));
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          changeInviteGroup(null);
        }
      }}
    >
      <DialogContent className="max-h-[95svh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{t("InviteUser")}</DialogTitle>
          <DialogDescription asChild>
            <div className="relative">
              <label htmlFor="forward-search">
                <Search
                  className="absolute start-3 top-1/2 -translate-y-1/2"
                  size={15}
                />
              </label>
              <Input
                className="w-full rounded-full ps-9 focus-visible:ring-0"
                id="forward-search"
                placeholder={t("Search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-1">
          {friendsListElements.length > 0 ? (
            <>
              <div className="text-gray-400">Friends List</div>
              {friendsListElements}
            </>
          ) : (
            "You don't have any friends."
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMenu;
