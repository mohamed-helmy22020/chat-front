import { useStatusStore } from "@/store/statusStore";
import { IoEyeOutline } from "react-icons/io5";

const StatusViewers = () => {
  const currentStatus = useStatusStore((state) => state.currentStatus);
  const viewers = (currentStatus?.statuses[currentStatus?.currentIndex] as any)
    .viewers as any[];
  return (
    <div className="mb-5 flex cursor-pointer items-center justify-center gap-2 select-none">
      <IoEyeOutline /> {viewers.length}
    </div>
  );
};

export default StatusViewers;
