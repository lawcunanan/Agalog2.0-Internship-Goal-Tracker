import { supabaseBrowser } from "@/lib/supabase/client";

const toPHTime = (date: Date) => {
	const PH_OFFSET = 8 * 60 * 60 * 1000; // UTC+8
	return new Date(date.getTime() + PH_OFFSET);
};

const fsToDate = (ts?: any) => {
	if (!ts) return null;

	if (typeof ts.toDate === "function") {
		return ts.toDate();
	}

	// Fallback (plain object)
	if (ts.seconds) {
		return new Date(ts.seconds * 1000);
	}

	return null;
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

			log_date: fsToDate(rawLog.timeIn)
				? toPHTime(fsToDate(rawLog.timeIn)!).toLocaleDateString("en-CA")
				: null,

			timeIn: fsToDate(rawLog.timeIn)
				? toPHTime(fsToDate(rawLog.timeIn)!)
				: null,

			timeOut: fsToDate(rawLog.timeOut)
				? toPHTime(fsToDate(rawLog.timeOut)!)
				: null,

			breakOut: fsToDate(rawLog.breakOut)
				? toPHTime(fsToDate(rawLog.breakOut)!)
				: null,

			breakBack: fsToDate(rawLog.breakBack)
				? toPHTime(fsToDate(rawLog.breakBack)!)
				: null,

			description: rawLog.description ?? null,
			created_at: fsToDate(rawLog.createdAt)
				? toPHTime(fsToDate(rawLog.createdAt)!)
				: null,
			updated_at: fsToDate(rawLog.updatedAt)
				? toPHTime(fsToDate(rawLog.updatedAt)!)
				: null,
		};

		const { error } = await supabaseBrowser.from("logs").insert(payload);

		if (error) throw error;

		showAlert(200, "Temp log inserted successfully");
	} catch (error: any) {
		showAlert(500, error.message || "Temp insert failed");
	} finally {
		setIsLoading(false);
	}
};
