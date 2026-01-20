import { Dispatch, SetStateAction } from "react";
import { StatsticsSelect } from "@/lib/types";
import { supabaseBrowser } from "@/lib/supabase/client";
import { getCountUsers } from "@/services/ssr/statistics/count-users";
import { getCountTodayLogs } from "@/services/ssr/statistics/count-today-logs";
import { getCountCompletedLogs } from "@/services/ssr/statistics/count-completed";

type RefreshStatisticsParams = {
	goal_id?: string | null;
	setStats: Dispatch<SetStateAction<StatsticsSelect>>;
	showAlert?: (status: number, message: string) => void;
};

type CountResult = {
	data: number | null;
	error: string | null;
};

export const refreshStatistics = async ({
	goal_id = null,

	setStats,
	showAlert,
}: RefreshStatisticsParams) => {
	try {
		if (!goal_id) {
			setStats({
				todayLogs: 0,
				completedGoals: 0,
				totalAdmins: 0,
				totalUsers: 0,
			});

			return;
		}

		const requests = [
			getCountUsers(supabaseBrowser, goal_id, "Student", "contributors"),
			getCountUsers(supabaseBrowser, goal_id, "Admin", "contributors"),
			getCountTodayLogs(supabaseBrowser, goal_id),
			getCountCompletedLogs(supabaseBrowser, goal_id),
		];

		const results = await Promise.allSettled<CountResult>(requests);

		const safeNumber = (result?: PromiseSettledResult<CountResult>): number =>
			result?.status === "fulfilled" ? result.value.data ?? 0 : 0;

		const newStats: StatsticsSelect = {
			totalUsers: safeNumber(results[0]),
			totalAdmins: safeNumber(results[1]),
			todayLogs: safeNumber(results[2]),
			completedGoals: safeNumber(results[3]),
		};

		setStats(newStats);
	} catch (error) {
		console.error("refreshStatistics error:", error);
		showAlert?.(500, "Failed to refresh statistics");
	}
};
