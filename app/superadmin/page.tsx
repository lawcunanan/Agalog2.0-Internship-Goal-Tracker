import { getUser } from "@/services/ssr/auth/get-user";
import { supabaseServer } from "@/lib/supabase/server";
import { SuperadminContent } from "@/components/pages/superadmin/page";

import { StatsticsSelect, UserDataSelect } from "@/lib/types";
import { getCountUsers } from "@/services/ssr/statistics/count-users";
import { getCountTodayLogs } from "@/services/ssr/statistics/count-today-logs";
import { getTodayLogs } from "@/services/ssr/logs/initial-today-logs";
import { getRegisteredGoals } from "@/services/ssr/goals/initial-registered-goals";
import { getUsers } from "@/services/ssr/users/initial-users";
import { getFilterOptions } from "@/services/ssr/filters/filter-options";

export default async function AdminPage() {
	//  Get logged-in user
	const user = await getUser();
	const supabase = await supabaseServer();
	if (!user) return <div>Please login to view this page</div>;

	//  Default values
	let initialStats: StatsticsSelect = {
		totalUsers: 0,
		totalAdmins: 0,
		todayLogs: 0,
	};
	let initialTodayLogs: UserDataSelect[] = [];
	let initialRegisteredGoals: UserDataSelect[] = [];
	let initialUsers: UserDataSelect[] = [];
	let initialSections: string[] = [];

	//  Fetch all SSR data in parallel
	const results = await Promise.allSettled([
		getCountUsers(supabase, null, "Student", "users"),
		getCountUsers(supabase, null, "Admin", "users"),
		getCountTodayLogs(supabase, null),

		getTodayLogs(supabase, null, "", "All Sections", 10, 1),
		getRegisteredGoals(supabase, "", "All Status", 10, 1),
		getUsers(supabase, "", "All Status", "All Roles", 10, 1),
		getFilterOptions(supabase, null),
	]);

	//  Helper to safely extract data
	const safeData = (result: PromiseSettledResult<any>) =>
		result.status === "fulfilled"
			? result.value
			: { data: null, companies: null, sections: null };

	//  Assign results
	initialStats = {
		totalUsers: safeData(results[0]).data ?? 0,
		totalAdmins: safeData(results[1]).data ?? 0,
		todayLogs: safeData(results[2]).data ?? 0,
	};
	initialTodayLogs = safeData(results[3]).data || [];
	initialRegisteredGoals = safeData(results[4]).data || [];
	initialUsers = safeData(results[5]).data || [];

	//  Assign filter options
	const filterOptions = safeData(results[6]);
	initialSections = filterOptions.sections || [];

	//  Render page with filters
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
