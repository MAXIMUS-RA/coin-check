"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, MonitorCog } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

const THEMES = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: MonitorCog },
] as const;

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="grid grid-cols-3 gap-1">
      {THEMES.map(({ value, label, Icon }) => {
        const active = theme === value;

        return (
          <Button
            key={value}
            type="button"
            variant="ghost"
            onClick={() => setTheme(value)}
            className={
              "h-8 px-2 text-xs " +
              (active
                ? "bg-indigo-600 text-white hover:bg-indigo-600"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground")
            }
            title={`Switch to ${label} theme`}
          >
            <Icon className="size-4" />
            <span className="hidden sm:inline">{label}</span>
          </Button>
        );
      })}
    </div>
  );
}
