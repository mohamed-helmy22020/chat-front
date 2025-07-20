"use client";

import { Locale } from "@/i18n/config";
import { setUserLocale } from "@/src/services/locale";
import { useLocaleStore } from "@/store/localeStore";
import * as Select from "@radix-ui/react-select";
import clsx from "clsx";
import { CheckIcon, Languages } from "lucide-react";
import { useEffect, useTransition } from "react";

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
        <div className="relative h-full aspect-square">
            <Select.Root defaultValue={defaultValue} onValueChange={onChange}>
                <Select.Trigger
                    aria-label={label}
                    className={clsx(
                        "rounded-sm py-2 transition-colors focus-visible:outline-none h-full aspect-square dark:hover:bg-black hover:bg-gray-300 hover:bg-opacity-30 dark:hover:bg-opacity-30 flex-center",
                        isPending && "pointer-events-none opacity-60"
                    )}
                >
                    <Select.Icon>
                        <Languages className="w-6 dark:text-white text-zinc-600  transition-colors  rounded-md" />
                    </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                    <Select.Content
                        align="end"
                        className="min-w-[8rem] overflow-hidden rounded-sm bg-white dark:bg-slate-800 py-1 shadow-md"
                        position="popper"
                    >
                        <Select.Viewport>
                            {items.map((item) => (
                                <Select.Item
                                    key={item.value}
                                    className="flex cursor-pointer items-center px-3 py-2 text-base data-[highlighted]:bg-slate-100 dark:data-[highlighted]:bg-slate-900 focus-visible:outline-none"
                                    value={item.value}
                                >
                                    <div className="mr-2 w-[1rem]">
                                        {item.value === defaultValue && (
                                            <CheckIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
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
