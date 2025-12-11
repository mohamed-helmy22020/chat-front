import { getUserData } from "@/lib/actions/user.actions";
import HomeSideBar from "./HomeSideBar";
import RenderPage from "./RenderPage";

const HomePage = async () => {
  const getUserRes = await getUserData();

  return (
    <div className="flex min-h-svh overflow-hidden">
      <HomeSideBar userProp={getUserRes?.userData} />
      <RenderPage />
      <audio
        src="/newmessage.mp3"
        className="message-sound invisible fixed top-0 left-0"
      />
    </div>
  );
};

export default HomePage;
