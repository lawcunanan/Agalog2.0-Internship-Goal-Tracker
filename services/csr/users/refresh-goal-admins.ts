import { Dispatch, SetStateAction } from "react";
import { UserDataSelect } from "@/lib/types";
import { getGoalAdmin } from "@/services/ssr/users/initial-goal-admins";
import { supabaseBrowser } from "@/lib/supabase/client";

interface RefreshGoalAdminsParams {
	goal_id: string | null;
	searchQuery: string;
	statusFilter: string;
	itemsPerPage: number;
	currentPage: number;
	showAlert: (status: number, message: string) => void;
	setAdminsData: Dispatch<SetStateAction<UserDataSelect[]>>;
	setTotalPages: Dispatch<SetStateAction<number>>;
}

export const refreshGoalAdmins = async ({
	goal_id,
	searchQuery,
	statusFilter,
	itemsPerPage,
	currentPage,
	showAlert,
	setAdminsData,
	setTotalPages,
}: RefreshGoalAdminsParams) => {
	const { data, totalPages, error } = await getGoalAdmin(
		supabaseBrowser,
		goal_id,
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
		setAdminsData(data);
		setTotalPages(totalPages);
	}
};
