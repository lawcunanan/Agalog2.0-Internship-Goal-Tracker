import { Dispatch, SetStateAction } from "react";
import { TodayLogSelect } from "@/lib/types";
import { getTodayLogs } from "@/services/ssr/logs/initial-today-logs";
import { supabaseBrowser } from "@/lib/supabase/client";

type RefreshTodayLogsParams = {
	goal_id: string | null;
	role: "Admin" | "Super Admin";
	searchQuery: string;
	sectionFilter: string;
	itemsPerPage: number;
	currentPage: number;
	showAlert: (status: number, message: string) => void;
	setTodayLogsData: Dispatch<SetStateAction<TodayLogSelect[]>>;
	setTotalPages: Dispatch<SetStateAction<number>>;
};

export const refreshTodayLogs = async ({
	goal_id,
	role,
	searchQuery,
	sectionFilter,
	itemsPerPage,
	currentPage,
	showAlert,
	setTodayLogsData,
	setTotalPages,
}: RefreshTodayLogsParams) => {
	if (!goal_id && role === "Admin") {
		setTodayLogsData([]);
		setTotalPages(1);
		return;
	}

	const { data, totalPages, error } = await getTodayLogs(
		supabaseBrowser,
		goal_id,
		searchQuery,
		sectionFilter,
		itemsPerPage,
		currentPage,
	);

	if (error) {
		showAlert(500, error);
		return;
	}

	if (data) {
		setTodayLogsData(data);
		setTotalPages(totalPages);
	}
};
