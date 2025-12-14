import { useTranslations } from "next-intl";
import { LuUser } from "react-icons/lu";
import PageAbout from "./PageAbout";
import SettingsProfile from "./SettingsProfile";

const Profile = () => {
  const t = useTranslations("Settings");
  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-col border-e-2 md:w-5/12">
        <div className="flex items-center p-5 select-none">
          <h1>{t("Profile.Title")}</h1>
        </div>
        <SettingsProfile />
      </div>
      <PageAbout title={t("Profile.Title")}>
        <LuUser size={100} />
      </PageAbout>
    </div>
  );
};

export default Profile;
