import HomeSideBar from "./HomeSideBar";
import RenderPage from "./RenderPage";
type Props = {
  userProp?: UserType;
};
const HomePage = ({ userProp }: Props) => {
  return (
    <div className="flex min-h-screen overflow-hidden">
      <HomeSideBar userProp={userProp} />
      <RenderPage />
    </div>
  );
};

export default HomePage;
