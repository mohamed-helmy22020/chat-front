import { getUserData } from "@/lib/actions/user.actions";
import HomeSideBar from "./HomeSideBar";
import RenderPage from "./RenderPage";

const HomePage = async () => {
  const getUserRes = await getUserData();
  return (
    <div className="flex min-h-screen overflow-hidden">
      <HomeSideBar userProp={getUserRes?.userData} />
      <RenderPage />
    </div>
  );
};

export default HomePage;
