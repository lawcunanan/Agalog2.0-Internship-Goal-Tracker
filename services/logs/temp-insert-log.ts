import { supabase } from "@/lib/supabase";

const fsToDate = (ts?: { seconds: number; nanoseconds: number }) => {
	if (!ts) return null;
	return new Date(ts.seconds * 1000);
};

export const tempInsertLog = async (
	userId: string,
	goalId: string,
	rawLog: any,
	showAlert: (status: number, message: string) => void,
	setIsLoading: (loading: boolean) => void,
) => {
	setIsLoading(true);

	try {
		if (!userId || !goalId) {
			throw new Error("User ID or Goal ID missing");
		}

		const payload = {
			user_id: userId,
			goal_id: goalId,

			log_date: fsToDate(rawLog.timeIn)?.toISOString().split("T")[0] ?? null,

			timeIn: fsToDate(rawLog.timeIn),
			timeOut: fsToDate(rawLog.timeOut),
			breakOut: fsToDate(rawLog.breakOut),
			breakBack: fsToDate(rawLog.breakBack),

			description: rawLog.description ?? null,
			created_at: fsToDate(rawLog.createdAt),
			updated_at: fsToDate(rawLog.updatedAt),
		};

		const { error } = await supabase.from("logs").insert(payload);

		if (error) throw error;

		showAlert(200, "Temp log inserted successfully");
	} catch (error: any) {
		console.error("Temp insert log error:", error);
		showAlert(500, error.message || "Temp insert failed");
	} finally {
		setIsLoading(false);
	}
};
