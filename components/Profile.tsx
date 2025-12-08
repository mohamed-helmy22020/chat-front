import { motion } from "motion/react";
import { LuUser } from "react-icons/lu";
import SettingsProfile from "./SettingsProfile";

const Profile = () => {
  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-col border-e-2 md:w-5/12">
        <div className="flex items-center p-5 select-none">
          <h1>Profile</h1>
        </div>
        <SettingsProfile />
      </div>
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "tween", duration: 0.1, ease: "easeOut" }}
        className="hidden w-7/12 flex-col items-center justify-center md:flex"
      >
        <LuUser size={100} />
        <p className="mt-5 text-center text-xl">Profile</p>
      </motion.div>
    </div>
  );
};

export default Profile;
