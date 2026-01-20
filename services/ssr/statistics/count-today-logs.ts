import { SupabaseClient } from "@supabase/supabase-js";
import { format } from "date-fns";

type CountTodayLogsResponse = {
	data: number | null;
	error: string | null;
};

export const getCountTodayLogs = async (
	supabase: SupabaseClient,
	goal_id: string | null,
): Promise<CountTodayLogsResponse> => {
	try {
		const today = format(new Date(), "yyyy-MM-dd");

		let query = supabase
			.from("logs")
			.select("log_id", { count: "exact", head: true })
			.eq("log_date", today);

		if (goal_id) {
			query = query.eq("goal_id", goal_id);
		}

		const { count, error } = await query;

		if (error) {
			console.log("getCountTodayLogs error:", error.message);
			return { data: null, error: error.message };
		}

		return { data: count ?? 0, error: null };
	} catch (error: any) {
		console.log(
			"getCountTodayLogs error:",
			error.message || "Unexpected error",
		);
		return {
			data: null,
			error: error.message || "Unexpected error",
		};
	}
};
