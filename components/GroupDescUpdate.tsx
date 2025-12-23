import { fetchWithErrorHandling } from "@/lib/utils";
import { useChatStore } from "@/store/chatStore";
import { useUserStore } from "@/store/userStore";
import clsx from "clsx";
import { Check, Loader, Pen } from "lucide-react";
import { useLocale } from "next-intl";
import { useState } from "react";
import { getLangDir } from "rtl-detect";
import { useShallow } from "zustand/react/shallow";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const GroupDescUpdate = () => {
  const locale = useLocale();
  const dir = getLangDir(locale);

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const BIO_LENGTH = 140;
  const { accessToken, currentUserId } = useUserStore(
    useShallow((state) => ({
      accessToken: state.user?.accessToken,
      currentUserId: state.user?._id,
    })),
  );
  const {
    desc,
    id: groupId,
    admin,
    groupSettings,
  } = useChatStore((state) => state.currentConversation) as Extract<
    ConversationType,
    { type: "group" }
  >;
  const isAdmin = admin === currentUserId;
  const canUpdateGroupData = isAdmin || groupSettings.members.editGroupData;
  const [descState, setDescState] = useState(desc);

  const handleUpdateName = async () => {
    if (descState === desc) {
      setIsEditing(false);
      return;
    }
    if (descState === "") {
      setDescState(desc);
      setIsEditing(false);
      return;
    }
    const formData = new FormData();
    formData.append("desc", descState as string);
    try {
      setIsLoading(true);
      const response = await fetchWithErrorHandling(`/chat/group/${groupId}`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.success) {
        throw new Error(response.msg);
      }
    } catch (error) {
      console.error("Error updating name:", error);
      setDescState(desc);
      return;
    } finally {
      setIsLoading(false);
    }

    setIsEditing(false);
  };
  return (
    <div className="flex flex-col text-sm">
      <div className="flex items-center justify-between">
        {!isEditing && (
          <>
            <p className="flex-1">{desc}</p>
            {canUpdateGroupData && (
              <Button
                onClick={() => {
                  setIsEditing(true);
                  setDescState(desc);
                }}
                variant="ghostFull"
                className="cursor-pointer"
              >
                <Pen />
              </Button>
            )}
          </>
        )}
        {isEditing && (
          <>
            <div className="relative flex-1">
              <Input
                type="text"
                className="w-full border-0 border-b-2 !bg-transparent !ring-0"
                autoFocus
                value={descState}
                onChange={(e) => {
                  if (e.target.value.length <= BIO_LENGTH) {
                    setDescState(e.target.value);
                  }
                }}
              />
              <div
                className={clsx(
                  "absolute -bottom-1 flex h-full items-center justify-center text-gray-400 select-none",
                  dir === "ltr" ? "right-0" : "left-0",
                )}
              >
                {BIO_LENGTH - parseInt(descState?.length.toString() as string)}
              </div>
            </div>
            <Button
              onClick={handleUpdateName}
              variant="ghostFull"
              className="cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? <Loader className="animate-spin" /> : <Check />}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default GroupDescUpdate;
