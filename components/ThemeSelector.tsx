"use client";

import { CheckIcon, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeSelector() {
    const { setTheme, theme } = useTheme();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="h-full aspect-square">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-full w-full dark:hover:bg-black hover:bg-gray-300 hover:bg-opacity-30 dark:hover:bg-opacity-30 rounded-md"
                    >
                        <Sun className="dark:text-white text-zinc-600 h-[1.2rem] w-[1.2rem] rotate-0 scale-125 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-125" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    {theme === "light" && (
                        <CheckIcon className="h-5 w-5 dark:text-slate-400" />
                    )}
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    {theme === "dark" && (
                        <CheckIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    )}
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    {theme === "system" && (
                        <CheckIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    )}
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
