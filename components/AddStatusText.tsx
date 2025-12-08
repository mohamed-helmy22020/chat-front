import { addTextStatus } from "@/lib/actions/user.actions";
import { getFontSizeForText, isTextExceeded } from "@/lib/utils";
import { useStatusStore } from "@/store/statusStore";
import { Loader2, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { IoMdSend } from "react-icons/io";
import { IoColorPaletteSharp } from "react-icons/io5";
import { toast } from "sonner";
import { Button } from "./ui/button";

type Props = {
  setShowAddText: React.Dispatch<React.SetStateAction<boolean>>;
};
const AddStatusText = ({ setShowAddText }: Props) => {
  const [color, setColor] = useState("bg-blue-500");
  const colorIndex = useRef(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const addUserStatus = useStatusStore((state) => state.addUserStatus);

  const changeColor = () => {
    const colors = [
      "bg-blue-500",
      "bg-red-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-orange-500",
      "bg-teal-500",
      "bg-indigo-500",
      "bg-gray-500",
    ];

    colorIndex.current = (colorIndex.current + 1) % colors.length;
    setColor(colors[colorIndex.current]);
  };

  const handleChangeText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isTextExceeded(e.target.value)) {
      toast.warning(
        "Your status update cannot exceed 700 characters or 5 lines.",
      );
      return;
    }
    setText(e.target.value);
  };

  const autoResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset to shrink if needed
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    autoResize();
  }, [text]);

  const handleSendingStatus = async () => {
    setIsSending(true);
    if (!text.trim()) {
      toast.error("Status cannot be empty.");
      return;
    }
    const addTextStatusRes = await addTextStatus(text);
    setIsSending(false);
    if (!addTextStatusRes.success) {
      toast.error(addTextStatusRes.msg);
      return;
    }
    setShowAddText(false);
    addUserStatus(addTextStatusRes.status);
    toast.success("Status added successfully!");
  };
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "tween" }}
      className={`fixed top-0 left-0 z-50 flex h-svh w-screen flex-col ${color}`}
    >
      <div className="flex justify-between px-6 py-6">
        <Button
          className="scale-200 cursor-pointer"
          variant="ghostFull"
          onClick={() => setShowAddText(false)}
        >
          <X />
        </Button>
        <Button
          className="h-fit scale-200 cursor-pointer rounded-full !p-1 hover:bg-gray-700"
          variant="ghostFull"
          onClick={changeColor}
        >
          <IoColorPaletteSharp />
        </Button>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <textarea
          className={`w-12/12 resize-none rounded-lg p-4 text-center focus:outline-none`}
          placeholder="What's on your mind?"
          rows={1}
          ref={textareaRef}
          value={text}
          onChange={handleChangeText}
          style={{
            fontSize: getFontSizeForText(text.length),
          }}
        ></textarea>
      </div>
      <div className="flex justify-end pe-9 pb-8">
        <Button
          className="h-fit scale-200 cursor-pointer rounded-full bg-green-700 !p-2"
          variant="ghostFull"
          onClick={handleSendingStatus}
          disabled={isSending}
        >
          {isSending ? <Loader2 className="animate-spin" /> : <IoMdSend />}
        </Button>
      </div>
    </motion.div>
  );
};

export default AddStatusText;
