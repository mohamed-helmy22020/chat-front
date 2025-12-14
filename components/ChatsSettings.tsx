import { Locale } from "@/i18n/config";
import { setUserLocale } from "@/src/services/locale";
import { useLocalStorage } from "@uidotdev/usehooks";
import { motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useState, useTransition } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { SettingsItem } from "./Settings";

type Props = {
  setCurrentSettings: (value?: string) => void;
};
const ChatsSettings = ({
  setCurrentSettings: setCurrentSettingsPage,
}: Props) => {
  const t = useTranslations("Settings");
  const [enterSend, saveEnterSend] = useLocalStorage("enterSend", "Enable");
  const locale = useLocale();
  const startTransition = useTransition()[1];

  const { setTheme, theme } = useTheme();
  const defaultChatSettings = {
    theme: theme,
    enterSend,
    locale,
  };

  const [settings, setSettings] = useState(defaultChatSettings);

  const handleChangeSettings = (name: string, value: string) => {
    if (name === "theme") {
      setTheme(value.toLowerCase());
      setSettings((prev) => ({
        ...prev,
        theme: value,
      }));
      return;
    }
    if (name === "enterSend") {
      setSettings((prev) => ({
        ...prev,
        enterSend: value,
      }));
      saveEnterSend(value);
      return;
    }
    if (name === "locale") {
      startTransition(() => {
        setUserLocale(value as Locale);
        setSettings((prev) => ({
          ...prev,
          locale: value,
        }));
      });
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
    >
      <div className="flex items-center p-5 select-none">
        <button
          onClick={() => setCurrentSettingsPage(undefined)}
          className="cursor-pointer pe-2"
        >
          <FaArrowLeft className="transition hover:-translate-x-1" />
        </button>
        <p>{t("Chats")}</p>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto px-5 py-2">
        <div className="text-xs text-gray-400">{t("ChatsNote")}</div>
        <SettingsItem
          handleChangeSettings={handleChangeSettings}
          value={settings.theme || "System"}
          title="Theme"
          name="theme"
          values={["dark", "light", "system"]}
        />
        <SettingsItem
          handleChangeSettings={handleChangeSettings}
          value={settings.locale}
          title="LocaleSwitcher.label"
          name="locale"
          values={["en", "ar"]}
          labels={{ en: "LocaleSwitcher.en", ar: "LocaleSwitcher.ar" }}
        />
        <SettingsItem
          handleChangeSettings={handleChangeSettings}
          value={settings.enterSend}
          title="EnterSend"
          name="enterSend"
          values={["Enable", "Disable"]}
        />
      </div>
    </motion.div>
  );
};

export default ChatsSettings;
