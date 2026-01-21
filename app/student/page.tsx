import { StudentContent } from "@/components/pages/student/page";
import { getUser } from "@/services/ssr/auth/get-user";
import { getInitialGoal } from "@/services/ssr/goals/initial-goal";
import { getLogs } from "@/services/ssr/logs/initial-logs";
import { supabaseServer } from "@/lib/supabase/server";
import { WeeklyLogState } from "@/lib/types";

export default async function StudentPage() {
	const user = await getUser();
	const supabase = await supabaseServer();

	if (!user)
		return <div className="text-center">Please login to view this page</div>;

	const initialGoal = await getInitialGoal(user.id);

	let logsData: WeeklyLogState = {
		logs: [],
		currentHours: 0,
	};

	if (initialGoal) {
		const results = await Promise.allSettled([
			getLogs(user.id, initialGoal.goal_id, supabase),
		]);

		//  Helper to safely extract data
		const safeData = (result: PromiseSettledResult<any>) =>
			result.status === "fulfilled" ? result.value : { data: null };

		const logsResult = safeData(results[0]);

		if (logsResult?.data) {
			logsData = {
				logs: logsResult.data.logs ?? [],
				currentHours: logsResult.data.currentHours ?? 0,
			};
		}
	}

	return <StudentContent initialGoal={initialGoal} logsData={logsData} />;
}
