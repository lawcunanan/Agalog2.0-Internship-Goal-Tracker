import { supabaseBrowser } from "@/lib/supabase/client";
import { LogValues } from "@/lib/types";
import { combineDateTime } from "@/lib/utils/dateTimeUtils";

export const upsertLog = async (
	user_id: string,
	goal_id: string,
	values: LogValues,
	showAlert: (status: number, message: string) => void,
	setIsLoading: (loading: boolean) => void,
) => {
	setIsLoading(true);

	try {
		if (!user_id || !goal_id) {
			throw new Error("User or Goal is missing");
		}

		const payload = {
			user_id: user_id,
			goal_id: goal_id,
			log_date: values.date,
			timeIn: combineDateTime(values.date, values.timeIn),
			timeOut: combineDateTime(values.date, values.timeOut),
			breakOut: combineDateTime(values.date, values.breakOut),
			breakBack: combineDateTime(values.date, values.breakBack),
			description: values.description || null,
		};

		const { error } = await supabaseBrowser.from("logs").upsert([payload], {
			onConflict: "user_id,goal_id,log_date",
		});

		if (error) throw error;

		showAlert(200, "Attendance saved successfully.");
	} catch (error: any) {
		showAlert(500, error.message || "Failed to save attendance");
	} finally {
		setIsLoading(false);
	}
};
