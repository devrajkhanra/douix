"use client";

import * as React from "react";
// import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <Button variant="ghost" size="icon">
      <Moon
        className="h-4 w-4 absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
        onClick={() => setTheme("light")}
      />
      <Sun
        className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
        onClick={() => setTheme("dark")}
      />
    </Button>
  );
}
