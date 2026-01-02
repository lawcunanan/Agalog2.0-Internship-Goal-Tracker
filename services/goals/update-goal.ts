import { supabase } from "@/lib/supabase";
import { GoalValues } from "@/lib/types";

export const updateGoalDetails = async (
	values: GoalValues,
	showAlert: (status: number, message: string) => void,
	setIsLoading: (loading: boolean) => void,
) => {
	setIsLoading(true);

	try {
		if (!values.goal_id) throw new Error("Goal ID is required");

		const { error } = await supabase
			.from("goals")
			.update({
				title: values.title,
				goal: values.goal || 400,
			})
			.eq("goal_id", values.goal_id);

		if (error) throw error;

		showAlert(200, "Goal updated successfully");
	} catch (error: any) {
		showAlert(500, error.message || "Failed to update goal");
	} finally {
		setIsLoading(false);
	}
};
