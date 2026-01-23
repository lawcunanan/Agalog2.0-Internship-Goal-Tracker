import { getUser } from "@/services/ssr/auth/get-user";
import { supabaseServer } from "@/lib/supabase/server";
import { SuperadminContent } from "@/components/pages/superadmin/page";

import {
	StatsticsSelect,
	TodayLogSelect,
	RegisteredGoalSelect,
	UserSelect,
	Paginated,
} from "@/lib/types";

import { getCountUsers } from "@/services/ssr/statistics/count-users";
import { getCountTodayLogs } from "@/services/ssr/statistics/count-today-logs";
import { getTodayLogs } from "@/services/ssr/logs/initial-today-logs";
import { getRegisteredGoals } from "@/services/ssr/goals/initial-registered-goals";
import { getUsers } from "@/services/ssr/users/initial-users";
import { getFilterOptions } from "@/services/ssr/filters/filter-options";

export default async function SuperAdminPage() {
	// Get logged-in user
	const user = await getUser();
	const supabase = await supabaseServer();

	if (!user)
		return <div className="text-center">Please login to view this page</div>;

	// Default values
	let initialStats: StatsticsSelect = {
		totalUsers: 0,
		totalAdmins: 0,
		todayLogs: 0,
	};

	// ✅ unified pagination structure
	let initialTodayLogs: Paginated<TodayLogSelect> = {
		data: [],
		totalPages: 0,
	};

	let initialRegisteredGoals: Paginated<RegisteredGoalSelect> = {
		data: [],
		totalPages: 0,
	};

	let initialUsers: Paginated<UserSelect> = {
		data: [],
		totalPages: 0,
	};

	let initialSections: string[] = [];

	// Fetch all SSR data in parallel
	const results = await Promise.allSettled([
		getCountUsers(supabase, null, "Student", "users"),
		getCountUsers(supabase, null, "Admin", "users"),
		getCountTodayLogs(supabase, null),

		// paginated
		getTodayLogs(supabase, null, "", "All Sections", 10, 1),
		getRegisteredGoals(supabase, "", "All Status", 10, 1),
		getUsers(supabase, "", "All Status", "All Roles", 10, 1),

		getFilterOptions(supabase, null),
	]);

	// safer typed helper
	const safeData = <T,>(result: PromiseSettledResult<T>): T | null =>
		result.status === "fulfilled" ? result.value : null;

	// Stats
	initialStats = {
		totalUsers: safeData(results[0])?.data ?? 0,
		totalAdmins: safeData(results[1])?.data ?? 0,
		todayLogs: safeData(results[2])?.data ?? 0,
	};

	// ✅ paginated assignments
	initialTodayLogs =
		safeData<Paginated<TodayLogSelect>>(results[3]) ?? initialTodayLogs;

	initialRegisteredGoals =
		safeData<Paginated<RegisteredGoalSelect>>(results[4]) ??
		initialRegisteredGoals;

	initialUsers = safeData<Paginated<UserSelect>>(results[5]) ?? initialUsers;

	// Filters
	const filterOptions = safeData(results[6]);
	initialSections = filterOptions?.sections || [];

	// Render page
	return (
		<SuperadminContent
			initialStats={initialStats}
			initialTodayLogs={initialTodayLogs}
			initialRegisteredGoals={initialRegisteredGoals}
			initialUsers={initialUsers}
			initialSections={initialSections}
		/>
	);
}
