import ProfileBio from "./ProfileBio";
import ProfileName from "./ProfileName";
import ProfilePictureUpdate from "./ProfilePictureUpdate";

const SettingsProfile = () => {
  return (
    <div className="flex flex-col gap-3 p-5">
      <ProfilePictureUpdate />
      <ProfileName />
      <ProfileBio />
    </div>
  );
};

export default SettingsProfile;
