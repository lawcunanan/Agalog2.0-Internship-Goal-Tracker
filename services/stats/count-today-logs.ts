import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

export const getCountTodayLogs = async (
	goalId: string | null,
	setCountLogs?: (count: number) => void,
	showAlert?: (status: number, message: string) => void,
) => {
	try {
		const today = format(new Date(), "yyyy-MM-dd");

		let query = supabase
			.from("logs")
			.select("log_id", { count: "exact", head: true })
			.eq("log_date", today);

		if (goalId) {
			query = query.eq("goal_id", goalId);
		}

		const { count, error } = await query;

		if (error) throw error;

		setCountLogs?.(count || 0);
	} catch (error: any) {
		console.error("Error fetching today's log count:", error);
		showAlert?.(500, error.message || "Failed to fetch today's logs");
	}
};
