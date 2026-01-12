import { SupabaseClient } from "@supabase/supabase-js";
import { format, differenceInMinutes } from "date-fns";
import { formatDuration } from "@/lib/utils/dateTimeUtils";
import { UserDataSelect } from "@/lib/types";

type TodayLogsResponse = {
	data: UserDataSelect[] | null;
	totalPages: number;
	error: string | null;
};

export const getTodayLogs = async (
	supabase: SupabaseClient,
	goalId: string | null,
	searchQuery: string,
	sectionFilter: string,
	itemsPerPage: number,
	currentPage: number,
): Promise<TodayLogsResponse> => {
	try {
		const from = (currentPage - 1) * itemsPerPage;
		const to = from + itemsPerPage - 1;

		let query = supabase
			.from("today_logs_view")
			.select("*", { count: "exact" })
			.order("created_at", { ascending: false })
			.range(from, to);

		// Optional goal filter
		if (goalId) {
			query = query.eq("goal_id", goalId);
		}

		// Section filter
		if (sectionFilter && sectionFilter !== "All Sections") {
			query = query.or(
				`section.ilike.%${sectionFilter}%,section.ilike.%${sectionFilter.replace(
					/\s+/g,
					"",
				)}%`,
			);
		}

		// Search by full name
		if (searchQuery) {
			query = query.ilike("full_name", `%${searchQuery}%`);
		}

		const { data, error, count } = await query;
		if (error) {
			console.error("getTodayLogs query error:", error.message);
			return { data: null, totalPages: 0, error: error.message };
		}

		const mapped: UserDataSelect[] =
			(data || []).map((l: any) => {
				const timeIn = l.time_in ? new Date(l.time_in) : null;
				const timeOut = l.time_out ? new Date(l.time_out) : null;
				const breakOut = l.break_out ? new Date(l.break_out) : null;
				const breakBack = l.break_back ? new Date(l.break_back) : null;

				let rawHours = 0;
				let breakMinutes = 0;

				if (timeIn && timeOut) {
					const totalMinutes = differenceInMinutes(timeOut, timeIn);
					if (breakOut && breakBack) {
						breakMinutes = differenceInMinutes(breakBack, breakOut);
					}
					rawHours = Math.max(0, (totalMinutes - breakMinutes) / 60);
				}

				return {
					user_id: l.user_id || "",
					picture: l.avatar_url || "",
					fullname: l.full_name || "",
					section: l.section || "",
					date: format(new Date(l.log_date), "MMM d, yyyy"),
					timeIn: timeIn ? format(timeIn, "hh:mm a") : "--:--",
					timeOut: timeOut ? format(timeOut, "hh:mm a") : "--:--",
					breakDuration: formatDuration(breakMinutes / 60),
					hoursWorked: formatDuration(rawHours),
					description: l.description || "",
					createdAt: l.created_at
						? format(new Date(l.created_at), "MMM d, yyyy h:mm a")
						: "--:--",
				};
			}) || [];

		const totalPages = Math.ceil((count || 0) / itemsPerPage);

		return { data: mapped, totalPages, error: null };
	} catch (error: any) {
		console.error(
			"getTodayLogs unexpected error:",
			error.message || "Unexpected error",
		);
		return {
			data: null,
			totalPages: 0,
			error: error.message || "Unexpected error",
		};
	}
};
