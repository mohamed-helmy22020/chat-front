import { motion } from "motion/react";
import { useLocale } from "next-intl";
import React from "react";
import { getLangDir } from "rtl-detect";

type Props = {
  children: React.ReactNode;
  title: string;
  about1?: string;
  about2?: string;
};

const PageAbout = ({ children, title, about1, about2 }: Props) => {
  const locale = useLocale();
  const dir = getLangDir(locale);
  return (
    <motion.div
      initial={dir === "ltr" ? { opacity: 0, x: 500 } : { opacity: 0, x: -500 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "tween", duration: 0.1, ease: "easeOut" }}
      className="hidden flex-col items-center justify-center bg-site-foreground select-none md:flex md:w-7/12 lg:w-8/12"
    >
      {children}
      <p className="mt-2 text-center text-xl">{title}</p>
      {about1 && (
        <p className="text-md mt-5 p-9 pt-0 text-center text-slate-400">
          {about1}
          {about2 && (
            <>
              <br />
              {about2}
            </>
          )}
        </p>
      )}
    </motion.div>
  );
};

export default PageAbout;
