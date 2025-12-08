import { motion } from "motion/react";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { LuSettings } from "react-icons/lu";
import SettingsProfile from "./SettingsProfile";
import SettingsProfileCard from "./SettingsProfileCard";
import { Separator } from "./ui/separator";

const Settings = () => {
  const [currentSettings, setCurrentSettings] = useState<string>();

  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-col overflow-x-hidden border-e-2 md:w-5/12">
        {currentSettings === "profile" && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
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
        {!currentSettings && (
          <motion.div>
            <div className="flex items-center justify-between p-5 select-none">
              <h1>Settings</h1>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
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
          </motion.div>
        )}
      </div>
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "tween", duration: 0.1, ease: "easeOut" }}
        className="hidden w-7/12 flex-col items-center justify-center md:flex"
      >
        <LuSettings size={100} />
        <p className="mt-5 text-center text-xl">Settings</p>
      </motion.div>
    </div>
  );
};

export default Settings;
