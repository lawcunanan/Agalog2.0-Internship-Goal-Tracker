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

export const getHandleValues = (
	setGoalValues: Dispatch<SetStateAction<GoalsState | null>>,
) => {
	return (field: keyof GoalsState, value: string | number | string[]) => {
		setGoalValues((prev) => {
			const current = prev || {
				goal_id: "",
				title: "",
				goal: 0,
				sections: [],
				status: "Active",
			};
			return { ...current, [field]: value };
		});
	};
};
