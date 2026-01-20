"use client";

import { useEffect, useState } from "react";
import { LucideIcon, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { twMerge } from "tailwind-merge";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<div className="flex bg-muted rounded-full p-1 border">
				<div className="w-8 h-8" />
				<div className="w-8 h-8" />
			</div>
		);
	}

	const renderButton = (mode: "light" | "dark", Icon: LucideIcon) => {
		const isActive = theme === mode;
		const activeClasses =
			mode === "light"
				? "bg-orange-500 text-white shadow-sm hover:text-white hover:bg-orange-600"
				: "bg-violet-500 text-white shadow-sm hover:text-white hover:bg-violet-600";

		return (
			<Button
				variant="ghost"
				size="icon"
				aria-pressed={isActive}
				className={twMerge(
					"h-8 w-8 cursor-pointer rounded-full transition-all",
					isActive
						? activeClasses
						: "text-muted-foreground hover:text-foreground",
				)}
				onClick={() => setTheme(mode)}
			>
				<Icon className="h-4 w-4" />
				<span className="sr-only">
					{mode === "light" ? "Light mode" : "Dark mode"}
				</span>
			</Button>
		);
	};

	return (
		<div className="flex items-center gap-1 border rounded-full p-1 bg-background/50 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
			{renderButton("light", Sun)}
			{renderButton("dark", Moon)}
		</div>
	);
}
