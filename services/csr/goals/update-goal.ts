import { supabaseBrowser } from "@/lib/supabase/client";
import { GoalsState } from "@/lib/types";

export const updateGoal = async (
	values: GoalsState,
	showAlert: (status: number, message: string) => void,
	setIsLoading: (loading: boolean) => void,
) => {
	setIsLoading(true);

	try {
		if (!values.goal_id) throw new Error("Goal ID is required");

		const { error } = await supabaseBrowser
			.from("goals")
			.update({
				title: values.title,
				goal: values.goal || 400,
				sections: values.sections || [],
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
