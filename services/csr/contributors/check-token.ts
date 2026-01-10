import { supabaseBrowser } from "@/lib/supabase/client";
import { GoalsState, UserRole } from "@/lib/types";

export const checkToken = async (
	user_id: string,
	token: string,
	role: UserRole,
	setGoalValues: (goal: GoalsState) => void,
	showAlert: (status: number, message: string) => void,
	setIsLoading: (loading: boolean) => void,
) => {
	setIsLoading(true);

	try {
		const tokenColumn = role === "Student" ? "pubToken" : "priToken";

		const { data: goalData, error: goalError } = await supabaseBrowser
			.from("goals")
			.select("goal_id, title, goal, sections, created_by")
			.eq(tokenColumn, token)
			.eq("status", "Active")
			.neq("created_by", user_id)
			.single();

		if (goalError || !goalData) {
			throw new Error("Invalid Token or Goal not found");
		}

		setGoalValues({
			goal_id: goalData.goal_id,
			title: goalData.title,
			goal: goalData.goal,
			sections: goalData.sections,
			created_by: goalData.created_by,
		});
	} catch (error: any) {
		showAlert(500, error.message || "Failed to join goal");
	} finally {
		setIsLoading(false);
	}
};
