import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import SettingsProfile from "./SettingsProfile";
import SettingsProfileCard from "./SettingsProfileCard";
import { Separator } from "./ui/separator";

const Settings = () => {
  const [currentSettings, setCurrentSettings] = useState<string>();

  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-col border-e-2 md:w-5/12">
        {currentSettings === "profile" && (
          <>
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
          </>
        )}
        {!currentSettings && (
          <>
            <div className="flex items-center justify-between p-5 select-none">
              <h1>Settings</h1>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              <button
                onClick={() => setCurrentSettings("profile")}
                className="w-full"
              >
                <SettingsProfileCard />
              </button>
              <Separator className="mt-2" />
            </div>
          </>
        )}
      </div>
      <div className="hidden w-7/12 items-center justify-center md:flex">a</div>
    </div>
  );
};

export default Settings;
