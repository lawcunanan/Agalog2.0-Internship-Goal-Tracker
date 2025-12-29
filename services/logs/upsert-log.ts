import { supabase } from "@/lib/supabase";
import { LogValues } from "@/lib/types";
import { combineDateTime } from "@/lib/utils/dateTimeUtils";

export const upsertLog = async (
	userId: string,
	goalId: string,
	values: LogValues,
	showAlert: (status: number, message: string) => void,
	setIsLoading: (loading: boolean) => void,
) => {
	setIsLoading(true);

	try {
		if (!userId || !goalId) {
			throw new Error("User or Goal is missing");
		}

		const payload = {
			user_id: userId,
			goal_id: goalId,
			log_date: values.date,
			timeIn: combineDateTime(values.date, values.timeIn),
			timeOut: combineDateTime(values.date, values.timeOut),
			breakOut: combineDateTime(values.date, values.breakOut),
			breakBack: combineDateTime(values.date, values.breakBack),
			description: values.description || null,
		};

		const { error } = await supabase.from("logs").upsert([payload], {
			onConflict: "user_id,goal_id,log_date",
		});

		if (error) throw error;

		showAlert(200, "Attendance saved successfully.");
	} catch (error: any) {
		console.error("Insert/update log error:", error);
		showAlert(500, error.message || "Failed to save attendance");
	} finally {
		setIsLoading(false);
	}
};
