"use client";

import { Locale } from "@/i18n/config";
import { setUserLocale } from "@/src/services/locale";
import { useLocaleStore } from "@/store/localeStore";
import * as Select from "@radix-ui/react-select";
import clsx from "clsx";
import { useEffect, useTransition } from "react";
import { LuCheck, LuLanguages } from "react-icons/lu";

type Props = {
  defaultValue: string;
  items: Array<{ value: string; label: string }>;
  label: string;
};

export default function LocaleSwitcherSelect({
  defaultValue,
  items,
  label,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const changeLocale = useLocaleStore((state) => state.changeLocale);

  function onChange(value: string) {
    const locale = value as Locale;
    startTransition(() => {
      setUserLocale(locale);
      changeLocale(locale as Locale);
    });
  }

  useEffect(() => {
    changeLocale(defaultValue as Locale);
  }, [changeLocale, defaultValue]);

  return (
    <div className="relative aspect-square h-full">
      <Select.Root defaultValue={defaultValue} onValueChange={onChange}>
        <Select.Trigger
          aria-label={label}
          className={clsx(
            "hover:bg-opacity-30 dark:hover:bg-opacity-30 flex-center aspect-square h-full rounded-sm py-2 transition-colors hover:bg-gray-300 focus-visible:outline-none dark:hover:bg-black",
            isPending && "pointer-events-none opacity-60",
          )}
        >
          <Select.Icon>
            <LuLanguages className="w-6 rounded-md text-zinc-600 transition-colors dark:text-white" />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            align="end"
            className="min-w-[8rem] overflow-hidden rounded-sm bg-white py-1 shadow-md dark:bg-slate-800"
            position="popper"
          >
            <Select.Viewport>
              {items.map((item) => (
                <Select.Item
                  key={item.value}
                  className="flex cursor-pointer items-center px-3 py-2 text-base focus-visible:outline-none data-[highlighted]:bg-slate-100 dark:data-[highlighted]:bg-slate-900"
                  value={item.value}
                >
                  <div className="mr-2 w-[1rem]">
                    {item.value === defaultValue && (
                      <LuCheck className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    )}
                  </div>
                  <span className="text-slate-900 dark:text-slate-300">
                    {item.label}
                  </span>
                </Select.Item>
              ))}
            </Select.Viewport>
            <Select.Arrow className="fill-white text-white dark:fill-slate-800 dark:text-slate-800" />
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
