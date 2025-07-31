import SettingsProfile from "./SettingsProfile";

const Profile = () => {
  return (
    <div className="flex flex-1">
      <div className="flex h-full w-5/12 flex-col border-e-2">
        <div className="flex items-center p-5 select-none">
          <h1>Profile</h1>
        </div>
        <SettingsProfile />
      </div>
      <div className="flex w-7/12 items-center justify-center">a</div>
    </div>
  );
};

export default Profile;
