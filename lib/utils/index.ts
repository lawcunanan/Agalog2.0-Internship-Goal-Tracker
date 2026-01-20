import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { GoalsState } from "@/lib/types";
import { Dispatch, SetStateAction } from "react";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getInitials = (name?: string) => {
	if (!name) return "U";
	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
};

export const handleFormChange = <T extends object>(
	setState: React.Dispatch<React.SetStateAction<T>>,
	key: keyof T,
	value: T[keyof T],
) => {
	setState((prev) => ({
		...prev,
		[key]: value,
	}));
};
