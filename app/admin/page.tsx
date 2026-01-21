import { getUser } from "@/services/ssr/auth/get-user";
import { supabaseServer } from "@/lib/supabase/server";
import { AdminContent } from "@/components/pages/admin/page";
import { getInitialGoal } from "@/services/ssr/goals/initial-goal";

import {
	StatsticsSelect,
	TodayLogSelect,
	UserSummarySelect,
	GoalAdminSelect,
} from "@/lib/types";
import { getCountUsers } from "@/services/ssr/statistics/count-users";
import { getCountTodayLogs } from "@/services/ssr/statistics/count-today-logs";
import { getCountCompletedLogs } from "@/services/ssr/statistics/count-completed";
import { getTodayLogs } from "@/services/ssr/logs/initial-today-logs";
import { getUserSummary } from "@/services/ssr/users/initial-user-summary";
import { getGoalAdmin } from "@/services/ssr/users/initial-goal-admins";
import { getFilterOptions } from "@/services/ssr/filters/filter-options";

export default async function AdminPage() {
	//  Get logged-in user
	const user = await getUser();
	const supabase = await supabaseServer();

	if (!user)
		return <div className="text-center">Please login to view this page</div>;

	//  Get initial goal
	const initialGoal = await getInitialGoal(user.id);

	//  Default values
	let initialStats: StatsticsSelect = {
		totalUsers: 0,
		totalAdmins: 0,
		todayLogs: 0,
		completedGoals: 0,
	};
	let initialTodayLogs: TodayLogSelect[] = [];
	let initialUserSummary: UserSummarySelect[] = [];
	let initialAdminGoals: GoalAdminSelect[] = [];
	let initialCompanies: string[] = [];
	let initialSections: string[] = [];

	//  Fetch all SSR data in parallel
	if (initialGoal) {
		const results = await Promise.allSettled([
			getCountUsers(supabase, initialGoal.goal_id, "Student", "contributors"),
			getCountUsers(supabase, initialGoal.goal_id, "Admin", "contributors"),
			getCountTodayLogs(supabase, initialGoal.goal_id),
			getCountCompletedLogs(supabase, initialGoal.goal_id),
			getTodayLogs(supabase, initialGoal.goal_id, "", "All Sections", 10, 1),
			getUserSummary(
				supabase,
				initialGoal.goal_id,
				"",
				"All Sections",
				"All Companies",
				10,
				1,
			),
			getGoalAdmin(supabase, initialGoal.goal_id, "", "All Status", 10, 1),
			getFilterOptions(supabase, initialGoal.goal_id),
		]);

		//  Helper to safely extract data
		const safeData = (result: PromiseSettledResult<any>) =>
			result.status === "fulfilled" ? result.value : { data: null };

		//  Assign results
		initialStats = {
			totalUsers: safeData(results[0]).data ?? 0,
			totalAdmins: safeData(results[1]).data ?? 0,
			todayLogs: safeData(results[2]).data ?? 0,
			completedGoals: safeData(results[3]).data ?? 0,
		};
		initialTodayLogs = safeData(results[4]).data || [];
		initialUserSummary = safeData(results[5]).data || [];
		initialAdminGoals = safeData(results[6]).data || [];

		//  Assign filter options
		const filterOptions = safeData(results[7]);
		initialCompanies = filterOptions.companies || [];
		initialSections = filterOptions.sections || [];
	}

	//  Render page with filters
	return (
		<AdminContent
			initialGoal={initialGoal}
			initialStats={initialStats}
			initialTodayLogs={initialTodayLogs}
			initialUserSummary={initialUserSummary}
			initialAdminGoals={initialAdminGoals}
			initialCompanies={initialCompanies}
			initialSections={initialSections}
		/>
	);
}
