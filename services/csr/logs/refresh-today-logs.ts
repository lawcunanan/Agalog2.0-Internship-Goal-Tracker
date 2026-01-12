import { Dispatch, SetStateAction } from "react";
import { UserDataSelect } from "@/lib/types";
import { getTodayLogs } from "@/services/ssr/logs/initial-today-logs";
import { supabaseBrowser } from "@/lib/supabase/client";

interface RefreshTodayLogsParams {
	goal_id: string | null;
	searchQuery: string;
	sectionFilter: string;
	itemsPerPage: number;
	currentPage: number;
	showAlert: (status: number, message: string) => void;
	setTodayLogsData: Dispatch<SetStateAction<UserDataSelect[]>>;
	setTotalPages: Dispatch<SetStateAction<number>>;
}

export const refreshTodayLogs = async ({
	goal_id,
	searchQuery,
	sectionFilter,
	itemsPerPage,
	currentPage,
	showAlert,
	setTodayLogsData,
	setTotalPages,
}: RefreshTodayLogsParams) => {
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
