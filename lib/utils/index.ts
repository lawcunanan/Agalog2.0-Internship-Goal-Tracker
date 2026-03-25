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

/**
 * Generates a report filename.
 * e.g. "AR Week5_Dec15-19 Cunanan L" or "WAR Week5_Dec15-19 Cunanan L"
 */
export const getReportFileName = (
	type: "AR" | "WAR",
	weekLabel: string,
	startDate: string,
	endDate: string,
	fullName: string,
) => {
	const parseShort = (dateStr: string) => {
		const [month, dayStr] = dateStr.split(" ");
		const day = parseInt(dayStr);
		return { month: month.slice(0, 3), day };
	};

	const start = parseShort(startDate);
	const end = parseShort(endDate);

	const dateRange =
		start.month === end.month
			? `${start.month}${start.day}-${end.day}`
			: `${start.month}${start.day}-${end.month}${end.day}`;

	const parts = fullName.trim().split(" ");
	const lastName = parts.length > 1 ? parts[parts.length - 1] : parts[0];
	const firstInitial = parts.length > 1 ? parts[0][0].toUpperCase() : "";

	const namePart = firstInitial ? `${lastName} ${firstInitial}` : lastName;

	return `${type} Week${weekLabel}_${dateRange} ${namePart}`;
};
