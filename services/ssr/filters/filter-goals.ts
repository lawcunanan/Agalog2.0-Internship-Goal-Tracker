import { SupabaseClient } from "@supabase/supabase-js";
import { FilterGoalSelect } from "@/lib/types";
import { FilterGoalRow } from "@/lib/types-row";

type GoalsResponse = {
	data: FilterGoalSelect[] | null;
	error: string | null;
};

export const getFilterGoals = async (
	supabase: SupabaseClient,
	auth_id: string,
	student_id: string,
): Promise<GoalsResponse> => {
	try {
		// 1. Get active goals of the authenticated user
		const { data: authGoals, error: authError } = await supabase
			.from("contributors")
			.select("goal_id")
			.eq("user_id", auth_id);

		if (authError) {
			console.log("getGoalsStudent auth goals error:", authError.message);
			return { data: null, error: authError.message };
		}

		const goalIds = authGoals?.map((g) => g.goal_id) || [];

		if (goalIds.length === 0) {
			return { data: [], error: null };
		}

		// 2. Fetch student goals limited to shared goal IDs
		const { data, error } = await supabase
			.from("contributors")
			.select(
				`
				goal_id,
				section,
				company,
				goals (
					title,
					goal
				)
			`,
			)
			.eq("user_id", student_id)
			.in("goal_id", goalIds)
			.order("created_at", { ascending: false })
			.overrideTypes<FilterGoalRow[], { merge: false }>();

		if (error) {
			console.log("getGoalsStudent goals error:", error.message);
			return { data: null, error: error.message };
		}

		const mapped: FilterGoalSelect[] =
			data?.map((item) => ({
				goal_id: String(item.goal_id),
				title: item.goals?.title || "Unknown Goal",
				goalHours: item.goals?.goal || 0,
				section: item.section,
				company: item.company,
			})) || [];

		return { data: mapped, error: null };
	} catch (error: any) {
		console.log(
			"getGoalsStudent unexpected error:",
			error.message || "Unexpected error",
		);
		return {
			data: null,
			error: error.message || "Unexpected error",
		};
	}
};
