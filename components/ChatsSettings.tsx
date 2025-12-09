import { useLocalStorage } from "@uidotdev/usehooks";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { SettingsItem } from "./Settings";

type Props = {
  setCurrentSettings: (value?: string) => void;
};
const ChatsSettings = ({
  setCurrentSettings: setCurrentSettingsPage,
}: Props) => {
  const [enterSend, saveEnterSend] = useLocalStorage("enterSend", "Enable");

  const { setTheme, theme } = useTheme();
  const defaultChatSettings = {
    theme: theme,
    enterSend,
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
      console.log(enterSend);
      setSettings((prev) => ({
        ...prev,
        enterSend: value,
      }));
      saveEnterSend(value);
      return;
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
        <p>Chats</p>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto px-5 py-2">
        <div className="text-md text-gray-200">
          Who can see my personal info
        </div>
        <div className="text-xs text-gray-400">
          *NOTE: Data here is not persistent across devices
        </div>
        <SettingsItem
          handleChangeSettings={handleChangeSettings}
          value={settings.theme || "System"}
          title="Theme"
          name="theme"
          values={["Dark", "Light", "System"]}
        />
        <SettingsItem
          handleChangeSettings={handleChangeSettings}
          value={settings.enterSend}
          title="Enter is send"
          name="enterSend"
          values={["Enable", "Disable"]}
        />
      </div>
    </motion.div>
  );
};

export default ChatsSettings;
