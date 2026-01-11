import { SupabaseClient } from "@supabase/supabase-js";
import { GoalActiveState } from "@/lib/types";
import { supabaseServer } from "@/lib/supabase/server";

export async function getInitialGoal(
	userId: string,
	supabase?: SupabaseClient,
): Promise<GoalActiveState | null> {
	const client = supabase ?? (await supabaseServer());
	if (!userId) {
		throw new Error("User ID is required");
	}

	const { data, error } = await client
		.from("contributors")
		.select(
			`
			goals!inner (
				goal_id,
				goal,
				status
			)
		`,
		)
		.eq("user_id", userId)
		.eq("status", "Active")
		.eq("goals.status", "Active")
		.order("created_at", { ascending: false })
		.limit(1)
		.single();

	if (error || !data?.goals) {
		return null;
	}

	const latestGoal = Array.isArray(data.goals) ? data.goals[0] : data.goals;

	return {
		goal_id: latestGoal.goal_id?.toString() ?? "",
		goalHours: latestGoal.goal ?? 400,
	};
}
