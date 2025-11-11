import { IoMdSend } from "react-icons/io";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const StatusReplay = () => {
  return (
    <div className="flex h-full w-full items-end justify-center pb-10">
      <div className="flex w-xl justify-center">
        <div className="flex-1">
          <Input
            className="w-full rounded-sm border-0 !bg-site-foreground/45 ring-0 placeholder:text-white"
            placeholder="Type your replay"
          />
        </div>
        <div>
          <Button variant="ghostFull" className="cursor-pointer">
            <IoMdSend />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StatusReplay;
