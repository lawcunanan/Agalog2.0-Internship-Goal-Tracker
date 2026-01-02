import { supabase } from "@/lib/supabase";

export const leaveGoalAsContributor = async (
	userId: string,
	goalId: string,
	status: "Active" | "Inactive",
	showAlert: (status: number, message: string) => void,
) => {
	try {
		if (!userId) throw new Error("User ID is required");
		if (!goalId) throw new Error("Goal ID is required");

		const { error } = await supabase
			.from("contributors")
			.update({ status: status })
			.eq("user_id", userId)
			.eq("goal_id", goalId);

		if (error) throw error;

		showAlert(200, "You have left the goal successfully");
	} catch (error: any) {
		showAlert(500, error.message || "Failed to leave the goal");
	}
};
