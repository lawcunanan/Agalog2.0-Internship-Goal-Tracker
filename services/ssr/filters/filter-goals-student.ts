import { SupabaseClient } from "@supabase/supabase-js";
import { GoalsState } from "@/lib/types";

type GoalsStudentResponse = {
	data: GoalsState[] | null;
	error: string | null;
};

export const getGoalsStudent = async (
	supabase: SupabaseClient,
	auth_id: string,
	student_id: string,
): Promise<GoalsStudentResponse> => {
	try {
		// 1. Get active goals of the authenticated user
		const { data: authGoals, error: authError } = await supabase
			.from("contributors")
			.select("goal_id")
			.eq("user_id", auth_id)
			.eq("status", "Active");

		if (authError) {
			console.error("getGoalsStudent auth goals error:", authError.message);
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
			.eq("status", "Active")
			.order("created_at", { ascending: false });

		if (error) {
			console.error("getGoalsStudent goals error:", error.message);
			return { data: null, error: error.message };
		}

		const mapped: GoalsState[] =
			data?.map((item: any) => ({
				goal_id: String(item.goal_id),
				title: item.goals?.title,
				goal: item.goals?.goal,
				section: item.section,
				company: item.company,
			})) || [];

		return { data: mapped, error: null };
	} catch (error: any) {
		console.error(
			"getGoalsStudent unexpected error:",
			error.message || "Unexpected error",
		);
		return {
			data: null,
			error: error.message || "Unexpected error",
		};
	}
};
