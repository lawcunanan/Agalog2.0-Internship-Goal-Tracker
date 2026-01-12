import { Dispatch, SetStateAction } from "react";
import { UserDataSelect } from "@/lib/types";
import { getRegisteredGoals } from "@/services/ssr/goals/initial-registered-goals";
import { supabaseBrowser } from "@/lib/supabase/client";

interface RefreshRegisteredGoalsParams {
	searchQuery: string;
	statusFilter: string;
	itemsPerPage: number;
	currentPage: number;
	showAlert: (status: number, message: string) => void;
	setGoalsData: Dispatch<SetStateAction<UserDataSelect[]>>;
	setTotalPages: Dispatch<SetStateAction<number>>;
}

export const refreshRegisteredGoals = async ({
	searchQuery,
	statusFilter,
	itemsPerPage,
	currentPage,
	showAlert,
	setGoalsData,
	setTotalPages,
}: RefreshRegisteredGoalsParams) => {
	const { data, totalPages, error } = await getRegisteredGoals(
		supabaseBrowser,
		searchQuery,
		statusFilter,
		itemsPerPage,
		currentPage,
	);

	if (error) {
		showAlert(500, error);
		return;
	}

	if (data) {
		setGoalsData(data);
		setTotalPages(totalPages);
	}
};
