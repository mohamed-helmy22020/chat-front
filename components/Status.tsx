import { useStatusStore } from "@/store/statusStore";
import { useTranslations } from "next-intl";
import { LuCircleDotDashed } from "react-icons/lu";
import AddStatus from "./AddStatus";
import MyStatus from "./MyStatus";
import PageAbout from "./PageAbout";
import Statuses from "./Statuses";
import StatusOverlay from "./StatusOverlay";

const Status = () => {
  const t = useTranslations("Status");
  const currentStatus = useStatusStore((state) => state.currentStatus);

  return (
    <>
      {currentStatus && <StatusOverlay />}
      <div className="flex flex-1">
        <div className="flex max-h-svh w-full flex-col border-e-2 md:w-5/12">
          <div className="flex items-center justify-between p-5">
            <h1>{t("Status")}</h1>
            <div className="flex">
              <AddStatus />
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <MyStatus />
            <Statuses />
          </div>
        </div>
        <PageAbout title={t("Title")} about1={t("About")}>
          <LuCircleDotDashed size={100} />
        </PageAbout>
      </div>
    </>
  );
};

export default Status;
