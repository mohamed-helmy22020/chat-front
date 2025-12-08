import { motion } from "motion/react";
import ProfileBio from "./ProfileBio";
import ProfileName from "./ProfileName";
import ProfilePictureUpdate from "./ProfilePictureUpdate";

const SettingsProfile = () => {
  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex flex-col gap-3 p-5"
    >
      <ProfilePictureUpdate />
      <ProfileName />
      <ProfileBio />
    </motion.div>
  );
};

export default SettingsProfile;
