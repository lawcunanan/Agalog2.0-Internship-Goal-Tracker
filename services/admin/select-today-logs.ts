import { supabase } from "@/lib/supabase";
import { format, differenceInMinutes } from "date-fns";
import { formatDuration } from "@/lib/utils/dateTimeUtils";
import { TodayLogsSelect } from "@/lib/types";

export const getTodayLogs = async (
	goalId: string | null,
	setTodayLogs: React.Dispatch<React.SetStateAction<TodayLogsSelect[]>>,
	searchQuery: string,
	sectionFilter: string,
	itemsPerPage: number,
	currentPage: number,
	setTotalPages: React.Dispatch<React.SetStateAction<number>>,
	showAlert: (status: number, message: string) => void,
) => {
	try {
		const today = format(new Date(), "yyyy-MM-dd");
		const from = (currentPage - 1) * itemsPerPage;
		const to = from + itemsPerPage - 1;

		let query = supabase
			.from("today_logs_view")
			.select("*", { count: "exact" })
			// .eq("log_date", today)
			.order("created_at", { ascending: false })
			.range(from, to);

		//optional goal filter
		if (goalId) {
			query = query.eq("goal_id", goalId);
		}

		// section filter
		if (sectionFilter && sectionFilter !== "All Sections") {
			query = query.or(
				`section.ilike.%${sectionFilter}%,section.ilike.%${sectionFilter.replace(
					/\s+/g,
					"",
				)}%`,
			);
		}

		// search by fullname
		if (searchQuery) {
			query = query.ilike("full_name", `%${searchQuery}%`);
		}

		const { data, error, count } = await query;
		if (error) throw error;

		// total pages
		setTotalPages(Math.ceil((count || 0) / itemsPerPage));

		const mapped: TodayLogsSelect[] =
			data?.map((l: any) => {
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
						? format(new Date(l.created_at), "MMM d, yyyy")
						: "--:--",
				};
			}) || [];

		setTodayLogs(mapped);
	} catch (error: any) {
		showAlert(500, error.message || "Failed to fetch logs");
	}
};
