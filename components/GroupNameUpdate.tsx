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

const GroupNameUpdate = () => {
  const locale = useLocale();
  const dir = getLangDir(locale);

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const NAME_LENGTH = 15;
  const { accessToken, currentUserId } = useUserStore(
    useShallow((state) => ({
      accessToken: state.user?.accessToken,
      currentUserId: state.user?._id,
    })),
  );
  const {
    groupName,
    id: groupId,
    admin,
    groupSettings,
  } = useChatStore((state) => state.currentConversation) as Extract<
    ConversationType,
    { type: "group" }
  >;
  const isAdmin = admin === currentUserId;
  const canUpdateGroupData = isAdmin || groupSettings.members.editGroupData;
  const [nameState, setNameState] = useState(groupName);

  const handleUpdateName = async () => {
    if (nameState === groupName) {
      setIsEditing(false);
      return;
    }
    if (nameState === "") {
      setNameState(groupName);
      setIsEditing(false);
      return;
    }
    const formData = new FormData();
    formData.append("name", nameState as string);
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
      setNameState(groupName);
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
            <p className="flex-1 text-center text-2xl">{groupName}</p>
            {canUpdateGroupData && (
              <Button
                onClick={() => {
                  setIsEditing(true);
                  setNameState(groupName);
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
                value={nameState}
                onChange={(e) => {
                  if (e.target.value.length <= NAME_LENGTH) {
                    setNameState(e.target.value);
                  }
                }}
              />
              <div
                className={clsx(
                  "absolute -bottom-1 flex h-full items-center justify-center text-gray-400 select-none",
                  dir === "ltr" ? "right-0" : "left-0",
                )}
              >
                {NAME_LENGTH - parseInt(nameState?.length.toString() as string)}
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

export default GroupNameUpdate;
