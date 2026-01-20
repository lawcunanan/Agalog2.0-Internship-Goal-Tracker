import { supabaseBrowser } from "@/lib/supabase/client";
import { Status } from "@/lib/types";

export const updateGoalStatus = async (
	user_id: string,
	goal_id: string,
	status: Status,
	showAlert: (status: number, message: string) => void,
	setIsLoading: (loading: boolean) => void,
) => {
	try {
		setIsLoading(true);
		if (!goal_id) throw new Error("Goal ID is required");
		if (!status) throw new Error("Status is required");

		const { error: goalError } = await supabaseBrowser
			.from("goals")
			.update({ status })
			.eq("goal_id", goal_id);

		if (goalError) throw goalError;

		const { error: contributorError } = await supabaseBrowser
			.from("contributors")
			.update({ status })
			.eq("user_id", user_id)
			.eq("goal_id", goal_id);

		if (contributorError) throw contributorError;

		showAlert(200, `Goal and contributors marked as ${status}`);
	} catch (error: any) {
		showAlert(500, error.message || "Failed to update goal status");
	} finally {
		setIsLoading(false);
	}
};
