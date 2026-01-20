import { SupabaseClient } from "@supabase/supabase-js";
import { LogValues, WeeklyLogSelect } from "@/lib/types";
import { format, startOfWeek, endOfWeek, differenceInMinutes } from "date-fns";
import { formatDuration } from "@/lib/utils/dateTimeUtils";
import { LogRow } from "@/lib/types-row";

type GetLogsResult = {
	data: {
		logs: WeeklyLogSelect[];
		currentHours: number;
	} | null;
	error: string | null;
};

export async function getLogs(
	user_id: string,
	goal_id: string,
	supabase: SupabaseClient,
): Promise<GetLogsResult> {
	try {
		if (!user_id || !goal_id) {
			return {
				data: null,
				error: "User ID and Goal ID are required",
			};
		}

		const { data: logsData, error } = await supabase
			.from("logs")
			.select(
				`log_id,
				 log_date,
				 timeIn,
				 timeOut,
				 breakOut,
				 breakBack,
				 description`,
			)
			.eq("goal_id", goal_id)
			.eq("user_id", user_id)
			.order("log_date", { ascending: true })
			.overrideTypes<LogRow[], { merge: false }>();

		if (error) throw error;
		if (!logsData?.length) {
			return { data: { logs: [], currentHours: 0 }, error: null };
		}

		/* ---------------- transform logs ---------------- */
		const logs: LogValues[] = logsData.map((l) => {
			const timeIn = l.timeIn ? new Date(l.timeIn) : null;
			const timeOut = l.timeOut ? new Date(l.timeOut) : null;
			const breakOut = l.breakOut ? new Date(l.breakOut) : null;
			const breakBack = l.breakBack ? new Date(l.breakBack) : null;

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
				log_id: l.log_id,
				date: l.log_date ? format(new Date(l.log_date), "MMM d") : "",
				fullDate: l.log_date,
				timeIn: timeIn ? format(timeIn, "hh:mm a") : "--:--",
				timeOut: timeOut ? format(timeOut, "hh:mm a") : "--:--",
				breakOut: breakOut ? format(breakOut, "hh:mm a") : undefined,
				breakBack: breakBack ? format(breakBack, "hh:mm a") : undefined,
				breakDuration: formatDuration(breakMinutes / 60),
				hoursWorked: formatDuration(rawHours),
				rawHours,
				description: l.description ?? "",
			};
		});

		/* ---------------- group by week ---------------- */
		const groupedWeeks: Record<string, LogValues[]> = {};

		logs.forEach((log) => {
			if (!log.fullDate) return;

			const fullDate = new Date(log.fullDate);
			const weekStart = startOfWeek(fullDate, { weekStartsOn: 1 });
			const weekKey = format(weekStart, "yyyy-MM-dd");

			if (!groupedWeeks[weekKey]) groupedWeeks[weekKey] = [];
			groupedWeeks[weekKey].push(log);
		});

		const sortedWeekKeys = Object.keys(groupedWeeks).sort();
		let runningTotal = 0;

		const weeklyData: WeeklyLogSelect[] = sortedWeekKeys.map((key, index) => {
			const weekLogs = groupedWeeks[key];
			const weekStart = new Date(key);
			const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });

			const thisPeriodRaw = weekLogs.reduce(
				(acc, log) => acc + (log.rawHours || 0),
				0,
			);

			const previousRaw = runningTotal;
			runningTotal += thisPeriodRaw;

			return {
				weekLabel: `Week ${index + 1}`,
				startDate: format(weekStart, "MMM d"),
				endDate: format(weekEnd, "MMM d"),
				previousHours: formatDuration(previousRaw),
				thisPeriodHours: formatDuration(thisPeriodRaw),
				totalHours: formatDuration(runningTotal),
				rawTotalHours: runningTotal,
				logs: weekLogs,
			};
		});

		return {
			data: {
				logs: weeklyData.reverse(),
				currentHours: runningTotal,
			},
			error: null,
		};
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : "Failed to fetch logs";

		console.error("[getLogs]", message);

		return {
			data: null,
			error: message,
		};
	}
}
