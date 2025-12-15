import { fetchWithErrorHandling, objShallowEqual } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";
import clsx from "clsx";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { getLangDir } from "rtl-detect";
import { useShallow } from "zustand/react/shallow";
import { SettingsItem } from "./Settings";
import { Button } from "./ui/button";

type Props = {
  setCurrentSettings: (value?: string) => void;
};
const PrivacySettings = ({
  setCurrentSettings: setCurrentSettingsPage,
}: Props) => {
  const locale = useLocale();
  const dir = getLangDir(locale);
  const t = useTranslations("Settings");
  const [isDataChanged, setIsDataChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { userSettings, changeUserSettings, accessToken } = useUserStore(
    useShallow((state) => ({
      userSettings: state.user?.settings,
      changeUserSettings: state.changeUserSettings,
      accessToken: state.user?.accessToken,
    })),
  );
  const userPrivacySettings = userSettings?.privacy;
  const defaultPrivacySettings: PrivacySettingsType = {
    online: "Friends",
    readReceipts: "Enable",
  };
  const [settings, setSettings] = useState<PrivacySettingsType>(
    userPrivacySettings || defaultPrivacySettings,
  );
  const handleChangeSettings = (name: string, value: string) => {
    setSettings((prev) => {
      return { ...prev, [name]: value };
    });
  };
  useEffect(() => {
    if (objShallowEqual(userPrivacySettings, settings)) {
      setIsDataChanged(false);
    } else {
      setIsDataChanged(true);
    }
  }, [settings, userPrivacySettings]);
  const handleSaveSettings = async () => {
    const formData = new FormData();
    formData.append("settings", JSON.stringify({ privacy: settings }));
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
      changeUserSettings({ privacy: settings });
    } catch (error) {
      console.error("Error updating name:", error);
      return;
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <motion.div
      initial={dir === "ltr" ? { x: 400 } : { x: -400 }}
      animate={{ x: 0 }}
      transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
    >
      <div className="flex items-center p-5 select-none">
        <button
          onClick={() => setCurrentSettingsPage(undefined)}
          className="cursor-pointer pe-2"
        >
          <FaArrowLeft
            className={clsx(
              "transition",
              dir === "ltr"
                ? "hover:-translate-x-1"
                : "rotate-180 hover:translate-x-1",
            )}
          />
        </button>
        <p>{t("Privacy")}</p>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto px-5 py-2">
        <div className="text-sm text-gray-400">
          {t("WhoCanSeePersonalInfo")}
        </div>
        <SettingsItem
          handleChangeSettings={handleChangeSettings}
          value={settings.online}
          title="Online"
          name="online"
          values={["Everyone", "Friends", "None"]}
        />
        <SettingsItem
          handleChangeSettings={handleChangeSettings}
          value={settings.readReceipts}
          title="ReadReceipts"
          name="readReceipts"
          values={["Enable", "Disable"]}
        />
      </div>
      {isDataChanged && (
        <div className="flex items-center justify-end gap-3 px-5 py-3">
          <Button
            variant={"ghostFull"}
            className="rounded-md bg-gray-600 !p-2 px-3 py-1 text-white hover:opacity-80"
            onClick={() => {
              setSettings(userPrivacySettings || defaultPrivacySettings);
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="ghostFull"
            className="rounded-md bg-mainColor-500 !p-2 px-3 py-1 text-white hover:opacity-80"
            onClick={handleSaveSettings}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Save"}
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default PrivacySettings;
