import { supabase } from "@/lib/supabase";
import { GoalStudentSelect } from "@/lib/types";

export const getGoalsStudent = async (
	authId: string,
	studentId: string,
	setGoals: React.Dispatch<React.SetStateAction<GoalStudentSelect[]>>,
	showAlert?: (status: number, message: string) => void,
) => {
	try {
		const { data: authGoals, error: authError } = await supabase
			.from("contributors")
			.select("goal_id")
			.eq("user_id", authId)
			.eq("status", "Active");

		if (authError) throw authError;

		const goalIds = authGoals?.map((g) => g.goal_id) || [];
		if (goalIds.length === 0) {
			setGoals([]);
			return;
		}

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
			.eq("user_id", studentId)
			.in("goal_id", goalIds)
			.eq("status", "Active")
			.order("created_at", { ascending: false });

		if (error) throw error;

		const mapped: GoalStudentSelect[] =
			data?.map((item: any) => ({
				goal_id: String(item.goal_id),
				title: item.goals?.title,
				goal: item.goals?.goal,
				section: item.section,
				company: item.company,
			})) || [];

		setGoals(mapped);
	} catch (error: any) {
		console.error("Error fetching goals for student:", error);
		showAlert?.(500, error.message || "Failed to fetch goals for student");
	}
};
