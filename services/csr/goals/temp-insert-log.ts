import { supabaseBrowser } from "@/lib/supabase/client";
import { combineDateTime } from "@/lib/utils/dateTimeUtils";

export type AgalogLogPayload = {
	date: string; // "YYYY-MM-DD"
	timeIn: string; // "HH:mm"
	timeOut: string; // "HH:mm"
	breakOut?: string; // "HH:mm"
	breakBack?: string; // "HH:mm"
	description?: string;
};

const isValidDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s);
const isValidTime = (s: string) => /^\d{2}:\d{2}$/.test(s);

export const tempInsertLogs = async (
	userId: string,
	goalId: string,
	logs: AgalogLogPayload[],
): Promise<{ inserted: number; skipped: number; errors: string[] }> => {
	if (!userId || !goalId) {
		throw new Error("User ID and Goal ID are required");
	}

	const errors: string[] = [];
	const rows = logs
		.map((log, i) => {
			if (!isValidDate(log.date)) {
				errors.push(`Row ${i + 1}: invalid date "${log.date}"`);
				return null;
			}
			if (!isValidTime(log.timeIn) || !isValidTime(log.timeOut)) {
				errors.push(`Row ${i + 1}: invalid time in/out`);
				return null;
			}
			return {
				user_id: userId,
				goal_id: goalId,
				log_date: log.date,
				timeIn: combineDateTime(log.date, log.timeIn),
				timeOut: combineDateTime(log.date, log.timeOut),
				breakOut: log.breakOut
					? combineDateTime(log.date, log.breakOut)
					: null,
				breakBack: log.breakBack
					? combineDateTime(log.date, log.breakBack)
					: null,
				description: log.description?.trim() || null,
			};
		})
		.filter((r): r is NonNullable<typeof r> => r !== null);

	if (rows.length === 0) {
		return { inserted: 0, skipped: logs.length, errors };
	}

	const { error } = await supabaseBrowser
		.from("logs")
		.upsert(rows, { onConflict: "user_id,goal_id,log_date" });

	if (error) {
		throw new Error(error.message);
	}

	return {
		inserted: rows.length,
		skipped: logs.length - rows.length,
		errors,
	};
};
