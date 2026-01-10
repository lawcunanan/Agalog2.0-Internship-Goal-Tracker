import { supabaseBrowser } from "@/lib/supabase/client";
import { generateToken } from "@/lib/utils/generateToken";
import { GoalsState } from "@/lib/types";

export const insertGoal = async (
	user_id: string,
	role: string,
	values: GoalsState,
	showAlert: (status: number, message: string) => void,
	setIsLoading: (loading: boolean) => void,
) => {
	setIsLoading(true);

	try {
		if (!user_id) {
			throw new Error("User ID is required");
		}

		let pubToken = null;
		let priToken = null;

		if (["Super Admin", "Admin"].includes(role)) {
			pubToken = generateToken(24);
			priToken = generateToken(24);
		}

		const { data: goalData, error: goalError } = await supabaseBrowser
			.from("goals")
			.insert([
				{
					title: values.title,
					goal: values.goal || 400,
					sections: values.sections || [],
					status: "Active",
					created_by: user_id,
					pubToken,
					priToken,
				},
			])
			.select("goal_id")
			.single();

		if (goalError || !goalData) {
			throw goalError;
		}

		const goal_id = goalData.goal_id;

		const { error: contributorError } = await supabaseBrowser
			.from("contributors")
			.insert([
				{
					goal_id: goal_id,
					user_id: user_id,
					status: "Active",
					role: "Owner",
				},
			]);

		if (contributorError) {
			throw contributorError;
		}

		showAlert(200, "Goal inserted successfully");
	} catch (error: any) {
		showAlert(500, error.message || "Error inserting goal");
	} finally {
		setIsLoading(false);
	}
};
