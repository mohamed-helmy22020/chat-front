import useLogout from "@/hooks/useLogout";
import { motion } from "motion/react";
import { memo, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { IoIosNotifications } from "react-icons/io";
import { LuMessageSquareText, LuSettings } from "react-icons/lu";
import { MdOutlineLogout, MdOutlinePrivacyTip } from "react-icons/md";
import ChatsSettings from "./ChatsSettings";
import NotificationsSettings from "./NotificationsSettings";
import PrivacySettings from "./PrivacySettings";
import SettingsCard from "./SettingsCard";
import SettingsProfile from "./SettingsProfile";
import SettingsProfileCard from "./SettingsProfileCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";

const ICONS_SIZE = 20;
const Settings = () => {
  const [currentSettings, setCurrentSettings] = useState<string>();
  const { logOut } = useLogout();
  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-col overflow-x-hidden border-e-2 md:w-7/12 lg:w-5/12">
        {!currentSettings && (
          <div>
            <div className="flex items-center justify-between p-5 select-none">
              <h1>Settings</h1>
            </div>
            {/** profile settings */}
            <div className="flex-1 overflow-x-hidden overflow-y-auto p-2">
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setCurrentSettings("profile")}
                className="w-full"
              >
                <SettingsProfileCard />
              </motion.button>
              <Separator className="mt-2" />
            </div>
            {/** privacy settings */}
            <SettingsCard
              title="privacy"
              desc="Manage your privacy and security"
              animationDelay={0.05}
              onClick={() => {
                setCurrentSettings("privacy");
              }}
            >
              <MdOutlinePrivacyTip size={ICONS_SIZE} />
            </SettingsCard>
            {/** chats settings */}
            <SettingsCard
              title="chats"
              desc="Theme, chat settings"
              animationDelay={0.1}
              onClick={() => {
                setCurrentSettings("chats");
              }}
            >
              <LuMessageSquareText size={ICONS_SIZE} />
            </SettingsCard>
            {/** notifications settings */}
            <SettingsCard
              title="notifications"
              desc="Message notifications"
              animationDelay={0.15}
              onClick={() => {
                setCurrentSettings("notifications");
              }}
            >
              <IoIosNotifications size={ICONS_SIZE} />
            </SettingsCard>
            {/** Logout settings */}
            <SettingsCard
              animationDelay={0.2}
              title="Log out"
              color="#cf3a3a"
              onClick={() => {
                logOut();
              }}
            >
              <MdOutlineLogout size={ICONS_SIZE} />
            </SettingsCard>
          </div>
        )}
        {/** Render settings */}
        {currentSettings === "profile" && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
          >
            <div className="flex items-center p-5 select-none">
              <button
                onClick={() => setCurrentSettings(undefined)}
                className="cursor-pointer pe-2"
              >
                <FaArrowLeft className="transition hover:-translate-x-1" />
              </button>
              <p>Profile</p>
            </div>
            <SettingsProfile />
          </motion.div>
        )}
        {currentSettings === "privacy" && (
          <PrivacySettings setCurrentSettings={setCurrentSettings} />
        )}
        {currentSettings === "chats" && (
          <ChatsSettings setCurrentSettings={setCurrentSettings} />
        )}
        {currentSettings === "notifications" && (
          <NotificationsSettings setCurrentSettings={setCurrentSettings} />
        )}
      </div>
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "tween", duration: 0.1, ease: "easeOut" }}
        className="hidden w-5/12 flex-col items-center justify-center select-none md:flex lg:w-7/12"
      >
        <LuSettings size={100} />
        <p className="mt-5 text-center text-xl">Settings</p>
      </motion.div>
    </div>
  );
};

export const SettingsItem = memo(
  ({
    title,
    name,
    value,
    handleChangeSettings,
    values,
  }: {
    title: string;
    name: string;
    values: string[];
    value: string;
    handleChangeSettings: (name: string, value: string) => void;
  }) => {
    return (
      <div className="mt-5 flex items-center justify-between text-gray-300">
        <p>{title}</p>
        <Select
          value={value}
          onValueChange={(value) => handleChangeSettings(name, value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue>{value}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {values.map((value) => (
              <SelectItem key={value} value={value} className="capitalize">
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  },
);
SettingsItem.displayName = "SettingsItem";
export default Settings;
