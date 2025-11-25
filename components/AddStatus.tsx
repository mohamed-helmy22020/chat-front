import { Button } from "@/components/ui/button";
import { FaImages, FaPencilAlt } from "react-icons/fa";

import {
  allowedPictureTypes,
  allowedVideoTypes,
  MAX_PHOTO_SIZE,
  MAX_VIDEO_SIZE,
} from "@/lib/utils";
import { useRef, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { toast } from "sonner";
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleAddMediaStatus = () => {
    fileInputRef.current?.click();
    setShowAddMedia(true);
    setShowAddText(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    const { type, size } = file;
    const isAllowedImage = allowedPictureTypes.includes(type);
    const isAllowedVideo = allowedVideoTypes.includes(type);

    if (!isAllowedImage && !isAllowedVideo) {
      toast.error(
        "Unsupported file type. Please select a JPEG, PNG, GIF, MP4, MOV, AVI, MKV, or WebM file.",
      );
      return;
    }

    if (isAllowedImage && size > MAX_PHOTO_SIZE) {
      toast.error("Image must be under 5 MB.");
      return;
    }

    if (isAllowedVideo && size > MAX_VIDEO_SIZE) {
      toast.error("Video must be under 100 MB.");
      return;
    }

    setSelectedFile(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      {showAddText && <AddStatusText setShowAddText={setShowAddText} />}
      {showAddMedia && selectedFile && (
        <AddStatusMedia
          setShowAddMedia={setShowAddMedia}
          setSelectedFile={setSelectedFile}
          file={selectedFile}
        />
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept={[...allowedPictureTypes, ...allowedVideoTypes].join(",")}
      />
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
              onClick={handleAddMediaStatus}
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
