"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
	const { setTheme, theme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return (
		<div className="flex items-center gap-1 border rounded-full p-1 bg-background/50 backdrop-blur-sm ">
			<Button
				variant="ghost"
				size="icon"
				className={`h-8 w-8 cursor-pointer rounded-full transition-all ${
					theme === "light"
						? "bg-orange-500 text-white shadow-sm hover:bg-orange-600 hover:text-white"
						: " text-muted-foreground hover:text-foreground"
				}`}
				onClick={() => setTheme("light")}
			>
				<Sun className="h-4 w-4" />
				<span className="sr-only">Light mode</span>
			</Button>
			<Button
				variant="ghost"
				size="icon"
				className={`h-8 w-8  cursor-pointer rounded-full transition-all ${
					theme === "dark"
						? "bg-violet-500 text-white shadow-sm hover:bg-violet-600 hover:text-white"
						: "text-muted-foreground hover:text-foreground"
				}`}
				onClick={() => setTheme("dark")}
			>
				<Moon className="h-4 w-4" />
				<span className="sr-only">Dark mode</span>
			</Button>
		</div>
	);
}
