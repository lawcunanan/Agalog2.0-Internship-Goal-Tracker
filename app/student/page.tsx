import { StudentContent } from "@/components/student/page";
import { getUser } from "@/services/ssr/auth/get-user";
import { getInitialGoal } from "@/services/ssr/goals/initial-goal";
import { getLogs } from "@/services/ssr/logs/initial-logs";
import { supabaseServer } from "@/lib/supabase/server";

export default async function StudentPage() {
	const user = await getUser();
	const supabase = await supabaseServer();
	const initialGoal = user ? await getInitialGoal(user.id) : null;
	let logsData: { logs: any; currentHours: number } | null = null;

	if (user && initialGoal) {
		const result = await getLogs(user.id, initialGoal.goal_id, supabase);
		if (result.data) {
			logsData = {
				logs: result.data.logs ?? [],
				currentHours: result.data.currentHours ?? 0,
			};
		}
	}

	return <StudentContent initialGoal={initialGoal} logsData={logsData} />;
}
