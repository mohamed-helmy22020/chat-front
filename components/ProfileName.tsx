import { fetchWithErrorHandling } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";
import clsx from "clsx";
import { Check, Loader, Pen } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { getLangDir } from "rtl-detect";
import { useShallow } from "zustand/react/shallow";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const ProfileName = () => {
  const t = useTranslations("Settings.Profile");
  const locale = useLocale();
  const dir = getLangDir(locale);

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const NAME_LENGTH = 25;
  const { name, accessToken, changeUserData } = useUserStore(
    useShallow((state) => ({
      name: state.user?.name,
      accessToken: state.user?.accessToken,
      changeUserData: state.changeUserData,
    })),
  );
  const [nameState, setNameState] = useState(name);

  const handleUpdateName = async () => {
    if (nameState === name) {
      setIsEditing(false);
      return;
    }
    if (nameState === "") {
      setNameState(name);
      setIsEditing(false);
      return;
    }
    const formData = new FormData();
    formData.append("name", nameState as string);
    try {
      setIsLoading(true);
      const response = await fetchWithErrorHandling("/user/data", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.success) {
        throw new Error(response.msg);
      }
      changeUserData({
        name: response.user.name,
      });
    } catch (error) {
      console.error("Error updating name:", error);
      setNameState(name);
      return;
    } finally {
      setIsLoading(false);
    }

    setIsEditing(false);
  };
  return (
    <div className="flex flex-col text-sm">
      <p className="text-gray-400">{t("YourName")}</p>
      <div className="flex items-center justify-between">
        {!isEditing && (
          <>
            <p>{name}</p>
            <Button
              onClick={() => {
                setIsEditing(true);
                setNameState(name);
              }}
              variant="ghostFull"
              className="cursor-pointer"
            >
              <Pen />
            </Button>
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

export default ProfileName;
