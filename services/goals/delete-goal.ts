import { supabase } from "@/lib/supabase";

export const updateGoalStatus = async (
	userId: string,
	goalId: string,
	status: "Active" | "Inactive",
	showAlert: (status: number, message: string) => void,
) => {
	try {
		if (!goalId) throw new Error("Goal ID is required");
		if (!status) throw new Error("Status is required");

		const { error: goalError } = await supabase
			.from("goals")
			.update({ status })
			.eq("goal_id", goalId);

		if (goalError) throw goalError;

		const { error: contributorError } = await supabase
			.from("contributors")
			.update({ status })
			.eq("user_id", userId)
			.eq("goal_id", goalId);

		if (contributorError) throw contributorError;

		showAlert(200, `Goal and contributors marked as ${status}`);
	} catch (error: any) {
		showAlert(500, error.message || "Failed to update goal status");
	}
};
