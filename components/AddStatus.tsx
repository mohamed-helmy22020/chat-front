import { Button } from "@/components/ui/button";
import { FaImages, FaPencilAlt } from "react-icons/fa";

import { useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import AddStatusMedia from "./AddStatusMedia";
import AddStatusText from "./AddStatusText";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const AddStatus = () => {
  const [showAddText, setShowAddText] = useState(false);
  const [showAddMedia, setShowAddMedia] = useState(false);
  return (
    <>
      {showAddText && <AddStatusText setShowAddText={setShowAddText} />}
      {showAddMedia && <AddStatusMedia showAddMedia={setShowAddMedia} />}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="cursor-pointer" variant="ghostFull">
                  <CiCirclePlus />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="rounded-full"
                sideOffset={0}
              >
                <p>Add Status</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Button
              variant="ghostFull"
              className="h-full w-full cursor-pointer justify-start !px-0 py-1"
              onClick={() => {
                setShowAddMedia(true);
                setShowAddText(false);
              }}
            >
              <FaImages />
              <span className="text-gray-400">Photos & Videos</span>
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button
              variant="ghostFull"
              className="h-full w-full cursor-pointer justify-start !px-0 py-1"
              onClick={() => {
                setShowAddText(true);
                setShowAddMedia(false);
              }}
            >
              <FaPencilAlt />
              <span className="text-gray-400">Text</span>
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default AddStatus;
