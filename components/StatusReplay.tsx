import clsx from "clsx";
import { useLocale, useTranslations } from "next-intl";
import { IoMdSend } from "react-icons/io";
import { getLangDir } from "rtl-detect";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const StatusReplay = () => {
  const t = useTranslations("Status.Overlay");
  const locale = useLocale();
  const dir = getLangDir(locale);
  return (
    <div className="flex h-full w-full items-end justify-center pb-10">
      <div className="flex w-xl justify-center">
        <div className="flex-1">
          <Input
            className="w-full rounded-sm border-0 !bg-site-foreground/45 ring-0 placeholder:text-white"
            placeholder={t("TypeReply")}
          />
        </div>
        <div>
          <Button
            variant="ghostFull"
            className={clsx("cursor-pointer", dir === "rtl" && "rotate-180")}
          >
            <IoMdSend />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StatusReplay;
