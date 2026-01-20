import { supabaseBrowser } from "@/lib/supabase/client";
import { Status } from "@/lib/types";

export const leaveGoalAsContributor = async (
	user_id: string,
	goal_id: string,
	status: Status,
	showAlert: (status: number, message: string) => void,
	setIsLoading: (loading: boolean) => void,
) => {
	try {
		setIsLoading(true);
		if (!user_id) throw new Error("User ID is required");
		if (!goal_id) throw new Error("Goal ID is required");

		const { error } = await supabaseBrowser
			.from("contributors")
			.update({ status: status })
			.eq("user_id", user_id)
			.eq("goal_id", goal_id);

		if (error) throw error;

		showAlert(200, "You have left the goal successfully");
	} catch (error: any) {
		showAlert(500, error.message || "Failed to leave the goal");
	} finally {
		setIsLoading(false);
	}
};
