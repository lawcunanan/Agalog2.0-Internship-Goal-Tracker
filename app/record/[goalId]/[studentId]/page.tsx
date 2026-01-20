import { RecordContent } from "@/components/pages/record/page";
import { getUser } from "@/services/ssr/auth/get-user";
import { supabaseServer } from "@/lib/supabase/server";
import {
	UserSelect,
	FilterGoalSelect,
	WeeklyLogState,
	GoalActiveState,
} from "@/lib/types";
import { getStudent } from "@/services/ssr/users/initial-student";
import { getFilterGoals } from "@/services/ssr/filters/filter-goals";
import { getLogs } from "@/services/ssr/logs/initial-logs";

type RecordPageProps = {
	params: Promise<{
		goalId: string; // can be "null"
		studentId: string;
	}>;
};

export default async function RecordPage({ params }: RecordPageProps) {
	const { goalId, studentId } = await params;

	// Get logged-in user
	const user = await getUser();
	const supabase = await supabaseServer();
	if (!user) return <div>Please login to view this page</div>;

	//  Default initial values
	let initialStudent: UserSelect | null = null;
	let initialGoalActiveState: GoalActiveState | null = null;
	let initialGoals: FilterGoalSelect[] = [];
	let logsData: WeeklyLogState = { logs: [], currentHours: 0 };
	let targetGoalId: string | null = goalId;

	//  Fetch student info and filtered goals in parallel
	const results = await Promise.allSettled([
		getStudent(supabase, studentId),
		getFilterGoals(supabase, user.id, studentId),
	]);

	// Helper to safely extract data
	function safeData<T>(result: PromiseSettledResult<T>, defaultValue: T): T {
		return result.status === "fulfilled" ? result.value : defaultValue;
	}

	const studentResult = safeData(results[0], { data: null, error: null });
	const goalsResult = safeData(results[1], { data: [], error: null });

	initialStudent = studentResult.data?.[0] ?? null;
	initialGoals = goalsResult.data ?? [];

	//  Determine which goalId to use if none or "null"
	if (!targetGoalId || targetGoalId === "null") {
		targetGoalId = initialGoals?.[0]?.goal_id ?? null;
	}

	//  Attach section & company to initialStudent based on targetGoalId
	if (initialStudent && targetGoalId) {
		const selectedGoal =
			initialGoals.find((g) => g.goal_id == targetGoalId) ?? initialGoals[0];
		if (selectedGoal) {
			initialGoalActiveState = {
				goal_id: selectedGoal.goal_id,
				goalHours: selectedGoal.goalHours || 0,
			};

			initialStudent.section = selectedGoal.section || undefined;
			initialStudent.company = selectedGoal.company || undefined;
		}
	}

	// Fetch logs if we have a valid goalId
	if (initialStudent?.user_id && targetGoalId) {
		const logsResult = await getLogs(
			initialStudent.user_id,
			targetGoalId,
			supabase,
		);
		if (logsResult?.data) {
			logsData = {
				logs: logsResult.data.logs ?? [],
				currentHours: logsResult.data.currentHours ?? 0,
			};
		}
	}

	//  Render page with all initial data
	return (
		<RecordContent
			targetStudentId={studentId}
			initialStudent={initialStudent}
			initialGoalActiveState={initialGoalActiveState}
			initialGoals={initialGoals}
			initialLogsData={logsData}
		/>
	);
}
