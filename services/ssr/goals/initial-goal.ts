import type { GoalActiveState } from "@/lib/types";
import { supabaseServer } from "@/lib/supabase/server";
import { GoalRow } from "@/lib/types-row";

export async function getInitialGoal(
	userId: string,
): Promise<GoalActiveState | null> {
	const supabase = await supabaseServer();

	if (!userId) {
		throw new Error("User ID is required");
	}

	const { data, error } = await supabase
		.from("contributors")
		.select(
			`
			company,
			goals!inner (
				goal_id,
				goal,
				status,
				sections
			)
		`,
		)
		.eq("user_id", userId)
		.eq("status", "Active")
		.eq("goals.status", "Active")
		.order("created_at", { ascending: false })
		.limit(1)
		.single()
		.overrideTypes<GoalRow, { merge: false }>();

	if (error || !data?.goals) {
		return null;
	}
	const latestGoal = Array.isArray(data.goals) ? data.goals[0] : data.goals;

	return {
		goal_id: latestGoal.goal_id?.toString() ?? "",
		goalHours: latestGoal.goal ?? 400,
		company: data.company ?? "Not Specified",
	};
}
