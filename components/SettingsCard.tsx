import { motion } from "motion/react";

type Props = {
  title: string;
  desc?: string;
  children: React.ReactNode;
  color?: string;
  animationDelay?: number;
  onClick: () => void;
};

const SettingsCard = ({
  title,
  desc,
  children,
  color,
  onClick,
  animationDelay = 0.1,
}: Props) => {
  return (
    <div
      className="flex-1 overflow-x-hidden overflow-y-auto p-2 pt-0"
      style={{ color: color }}
    >
      <motion.button
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "tween", delay: animationDelay }}
        onClick={onClick}
        className="w-full"
      >
        <div className="flex min-h-15 w-full cursor-pointer gap-4 rounded-md px-3 py-1.5 hover:bg-site-foreground">
          <div className="relative flex items-center justify-center">
            {children}
          </div>
          <div className="flex flex-1 flex-col justify-center text-start text-sm">
            <h2 className="text-md font-bold capitalize">{title}</h2>

            {desc && (
              <h2 className="line-clamp-1 text-xs text-gray-500">{desc}</h2>
            )}
          </div>
        </div>
      </motion.button>
    </div>
  );
};

export default SettingsCard;
