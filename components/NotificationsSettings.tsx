import { getNotificationsPermission } from "@/lib/utils";
import { useSettingsStore } from "@/store/settingsStore";
import clsx from "clsx";
import { motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { getLangDir } from "rtl-detect";
import { useShallow } from "zustand/react/shallow";
import { SettingsItem } from "./Settings";

type Props = {
  setCurrentSettings: (value?: string) => void;
};

const NotificationsSettings = ({ setCurrentSettings }: Props) => {
  const locale = useLocale();
  const dir = getLangDir(locale);
  const t = useTranslations("Settings");
  const initialized = useRef(false);
  const { changeNotificationsSettings, notificationsSettings } =
    useSettingsStore(
      useShallow((state) => ({
        changeNotificationsSettings: state.changeNotifcationsSettings,
        notificationsSettings: state.notifcationsSettings,
      })),
    );
  const handleChangeSettings = (name: string, value: string) => {
    changeNotificationsSettings({
      ...notificationsSettings,
      [name]: value,
    });
  };
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    getNotificationsPermission();
  }, [initialized]);

  return (
    <motion.div
      initial={dir === "ltr" ? { x: 400 } : { x: -400 }}
      animate={{ x: 0 }}
      transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
    >
      <div className="flex items-center p-5 select-none">
        <button
          onClick={() => setCurrentSettings(undefined)}
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
        <p>{t("Notifications")}</p>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto px-5 py-2">
        <div className="text-xs text-gray-400">{t("Messages")}</div>
        <SettingsItem
          handleChangeSettings={handleChangeSettings}
          value={notificationsSettings.messages}
          title="MessagesNotifications"
          name="messages"
          values={["Enable", "Disable"]}
        />
        <SettingsItem
          handleChangeSettings={handleChangeSettings}
          value={notificationsSettings.incomingCalls}
          title="IncomingCallsNotifications"
          name="incomingCalls"
          values={["Enable", "Disable"]}
        />
        <SettingsItem
          handleChangeSettings={handleChangeSettings}
          value={notificationsSettings.previews}
          title="ShowPreviews"
          name="previews"
          values={["Enable", "Disable"]}
        />
        <SettingsItem
          handleChangeSettings={handleChangeSettings}
          value={notificationsSettings.reactions}
          title="ShowReactionNotifications"
          name="reactions"
          values={["Enable", "Disable"]}
        />
      </div>
      <div className="mt-10 flex flex-1 flex-col overflow-y-auto px-5 py-2">
        <div className="text-xs text-gray-400">{t("NotificationsTones")}</div>

        <SettingsItem
          handleChangeSettings={handleChangeSettings}
          value={notificationsSettings.incomingMessagesSound}
          title="IncomingMessagesSound"
          name="incomingMessagesSound"
          values={["Enable", "Disable"]}
        />
        <SettingsItem
          handleChangeSettings={handleChangeSettings}
          value={notificationsSettings.incomingCallsSound}
          title="IncomingCallsSound"
          name="incomingCallsSound"
          values={["Enable", "Disable"]}
        />
      </div>
    </motion.div>
  );
};

export default NotificationsSettings;
