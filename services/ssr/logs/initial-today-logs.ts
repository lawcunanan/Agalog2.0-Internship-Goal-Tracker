import { SupabaseClient } from "@supabase/supabase-js";
import { format, differenceInMinutes } from "date-fns";
import { formatDuration } from "@/lib/utils/dateTimeUtils";
import { TodayLogSelect, Paginated } from "@/lib/types";
import { TodayLogsViewRow } from "@/lib/types-row";

export const getTodayLogs = async (
	supabase: SupabaseClient,
	goalId: string | null,
	searchQuery: string,
	sectionFilter: string,
	itemsPerPage: number,
	currentPage: number,
): Promise<Paginated<TodayLogSelect>> => {
	try {
		const from = (currentPage - 1) * itemsPerPage;
		const to = from + itemsPerPage - 1;

		let query = supabase
			.from("today_logs_view")
			.select(
				`
				user_id,
				avatar_url,
				full_name,
				section,
				log_date,
				time_in,
				time_out,
				break_out,
				break_back,
				description,
				created_at
				`,
				{ count: "exact" },
			)
			.order("created_at", { ascending: false })
			.range(from, to);

		// Optional goal filter
		if (goalId) query = query.eq("goal_id", goalId);

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

		const { data, error, count } = await query.overrideTypes<
			TodayLogsViewRow[],
			{ merge: false }
		>();

		if (error) {
			console.error("getTodayLogs query error:", error.message);
			return { data: [], totalPages: 0, error: error.message };
		}

		const mapped: TodayLogSelect[] = (data || []).map((l) => {
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
				avatar_url: l.avatar_url || "",
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
		});

		const totalPages = Math.ceil((count || 0) / itemsPerPage);

		return {
			data: mapped,
			totalPages,
			error: null, // no error
		};
	} catch (err: any) {
		console.error("getTodayLogs unexpected error:", err);
		return {
			data: [],
			totalPages: 0,
			error: err?.message || "Unexpected error",
		};
	}
};
