import { Dispatch, SetStateAction } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { FilterGoalSelect } from "@/lib/types";
import { getFilterGoals } from "@/services/ssr/filters/filter-goals";

type RefreshStudentGoalsParams = {
	auth_id: string;
	student_id: string;
	setGoals: Dispatch<SetStateAction<FilterGoalSelect[]>>;
	showAlert?: (status: number, message: string) => void;
};

export const refreshStudentGoals = async ({
	auth_id,
	student_id,
	setGoals,
	showAlert,
}: RefreshStudentGoalsParams) => {
	try {
		const { data, error } = await getFilterGoals(
			supabaseBrowser,
			auth_id,
			student_id,
		);

		if (error) {
			console.error("refreshStudentGoals error:", error);
			if (showAlert) showAlert(500, error);
			return;
		}

		if (data) setGoals(data);
	} catch (err: any) {
		console.error("refreshStudentGoals unexpected error:", err);
		if (showAlert) showAlert(500, "Failed to refresh student goals");
	}
};
