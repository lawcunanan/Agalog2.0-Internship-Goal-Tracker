import { supabase } from "@/lib/supabase";
import { WeeklyLogState, LogValues, WeeklyLogSelect } from "@/lib/types";
import { format, startOfWeek, endOfWeek, differenceInMinutes } from "date-fns";
import { formatDuration } from "@/lib/utils/dateTimeUtils";

export const getLogs = async (
	userId: string,
	goalId: string,
	setAttendanceState: React.Dispatch<React.SetStateAction<WeeklyLogState>>,
	showAlert: (status: number, message: string) => void,
) => {
	try {
		if (!userId || !goalId) return;

		// Fetch logs for this goal and user (RLS will enforce permissions)
		const { data: logsData, error } = await supabase
			.from("logs")
			.select("*")
			.eq("goal_id", goalId)
			.eq("user_id", userId)
			.order("log_date", { ascending: true });

		if (error) throw error;

		// Transform logs
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
				log_id: l.log_id.toString(),
				date: l.log_date ? format(new Date(l.log_date), "MMM d") : "",
				fullDate: l.log_date,
				timeIn: timeIn ? format(timeIn, "hh:mm a") : "--:--",
				timeOut: timeOut ? format(timeOut, "hh:mm a") : "--:--",
				breakOut: breakOut ? format(breakOut, "hh:mm a") : undefined,
				breakBack: breakBack ? format(breakBack, "hh:mm a") : undefined,
				breakDuration: formatDuration(breakMinutes / 60),
				hoursWorked: formatDuration(rawHours),
				rawHours,
				description: l.description || "",
			} as LogValues;
		});

		// Group logs by week
		const groupedWeeks: { [key: string]: LogValues[] } = {};
		logs.forEach((log) => {
			const fullDate = new Date(log.fullDate || "");
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

		let weeklyDataReversed = weeklyData.reverse();
		// Update state
		setAttendanceState((prev) => ({
			...prev,
			logs: weeklyDataReversed,
			currentHours: runningTotal,
		}));
	} catch (error: any) {
		showAlert(500, error.message || "Failed to fetch logs");
	}
};
