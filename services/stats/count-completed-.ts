import { supabase } from "@/lib/supabase";

export const getCountCompletedLogs = async (
	goalId: string | null,
	setCountCompleted?: (count: number) => void,
	showAlert?: (status: number, message: string) => void,
) => {
	try {
		let query = supabase
			.from("completed_goals_view")
			.select("*", { count: "exact", head: true });

		if (goalId) {
			query = query.eq("goal_id", goalId);
		}

		const { count, error } = await query;
		if (error) throw error;

		setCountCompleted?.(count || 0);
	} catch (error: any) {
		console.error("Error fetching completed logs:", error);
		showAlert?.(500, error.message || "Failed to fetch completed logs");
	}
};
