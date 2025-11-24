import { deleteStatus as deleteStatusAction } from "@/lib/actions/user.actions";
import { useStatusStore } from "@/store/statusStore";
import { useUserStore } from "@/store/userStore";
import { LuEllipsisVertical } from "react-icons/lu";
import { MdDelete } from "react-icons/md";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const StatusMenu = () => {
  const userId = useUserStore((state) => state.user?._id);
  const { currentStatus, deleteUserStatus, changeCurrentStatus } =
    useStatusStore(
      useShallow((state) => ({
        currentStatus: state.currentStatus,
        deleteUserStatus: state.deleteUserStatus,
        changeCurrentStatus: state.changeCurrentStatus,
      })),
    );
  const currentOpenedStatus =
    currentStatus?.statuses[currentStatus.currentIndex];

  const deleteStatus = async () => {
    try {
      const toastId = toast.loading("Deleting Status...");
      const deleteStatusRes = await deleteStatusAction(
        currentOpenedStatus?._id as string,
      );
      console.log(deleteStatusRes);
      if (deleteStatusRes.success) {
        deleteUserStatus(currentOpenedStatus?._id as string);
        changeCurrentStatus(userId as string, true);
        toast.dismiss(toastId);
        toast.success("Status deleted successfully.");
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="mx-4 cursor-pointer rounded-full p-1"
          variant="ghostFull"
        >
          <LuEllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={deleteStatus}>
          <MdDelete />
          Delete Status
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StatusMenu;
