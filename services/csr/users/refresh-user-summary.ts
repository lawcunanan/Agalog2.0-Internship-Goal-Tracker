import { Dispatch, SetStateAction } from "react";
import { UserDataSelect } from "@/lib/types";
import { getUserSummary } from "@/services/ssr/users/initial-user-summary";
import { supabaseBrowser } from "@/lib/supabase/client";

interface RefreshUserSummaryParams {
	goal_id: string | null;
	searchQuery: string;
	sectionFilter: string;
	companyFilter: string;
	itemsPerPage: number;
	currentPage: number;
	showAlert: (status: number, message: string) => void;
	setSummaryData: Dispatch<SetStateAction<UserDataSelect[]>>;
	setTotalPages: Dispatch<SetStateAction<number>>;
}

export const refreshUserSummary = async ({
	goal_id,
	searchQuery,
	sectionFilter,
	companyFilter,
	itemsPerPage,
	currentPage,
	showAlert,
	setSummaryData,
	setTotalPages,
}: RefreshUserSummaryParams) => {
	const { data, totalPages, error } = await getUserSummary(
		supabaseBrowser,
		goal_id,
		searchQuery,
		sectionFilter,
		companyFilter,
		itemsPerPage,
		currentPage,
	);

	if (error) {
		showAlert(500, error);
		return;
	}

	if (data) {
		setSummaryData(data);
		setTotalPages(totalPages);
	}
};
