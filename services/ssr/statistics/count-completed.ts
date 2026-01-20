import { SupabaseClient } from "@supabase/supabase-js";
type CountCompletedLogsResponse = {
	data: number | null;
	error: string | null;
};

export const getCountCompletedLogs = async (
	supabase: SupabaseClient,
	goal_id: string | null,
): Promise<CountCompletedLogsResponse> => {
	try {
		let query = supabase
			.from("completed_goals_view")
			.select("*", { count: "exact", head: true });

		if (goal_id) {
			query = query.eq("goal_id", goal_id);
		}

		const { count, error } = await query;

		if (error) {
			console.log("getCountCompletedLogs error:", error.message);
			return { data: null, error: error.message };
		}

		return { data: count ?? 0, error: null };
	} catch (error: any) {
		console.log(
			"getCountCompletedLogs error:",
			error.message || "Unexpected error",
		);
		return {
			data: null,
			error: error.message || "Unexpected error",
		};
	}
};
