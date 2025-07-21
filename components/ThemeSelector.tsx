"use client";

import { useTheme } from "next-themes";
import { LuCheck, LuMoon, LuSun } from "react-icons/lu";

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
        <div className="aspect-square h-full">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-opacity-30 dark:hover:bg-opacity-30 h-full w-full rounded-md hover:bg-gray-300 dark:hover:bg-black"
          >
            <LuSun className="h-[1.2rem] w-[1.2rem] scale-125 rotate-0 text-zinc-600 transition-all dark:scale-0 dark:-rotate-90 dark:text-white" />
            <LuMoon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-125 dark:rotate-0" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          {theme === "light" && (
            <LuCheck className="h-5 w-5 dark:text-slate-400" />
          )}
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          {theme === "dark" && (
            <LuCheck className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          )}
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          {theme === "system" && (
            <LuCheck className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          )}
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
