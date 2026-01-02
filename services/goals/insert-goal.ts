import { supabase } from "@/lib/supabase";
import { generateToken } from "@/lib/utils/generateToken";
import { GoalValues } from "@/lib/types";

export const insertGoal = async (
	userId: string,
	role: string,
	values: GoalValues,
	showAlert: (status: number, message: string) => void,
	setIsLoading: (loading: boolean) => void,
) => {
	setIsLoading(true);

	try {
		if (!userId) {
			throw new Error("User ID is required");
		}

		let pubToken = null;
		let priToken = null;

		if (["Super Admin", "Admin"].includes(role)) {
			pubToken = generateToken(24);
			priToken = generateToken(24);
		}

		const { data: goalData, error: goalError } = await supabase
			.from("goals")
			.insert([
				{
					...values,
					status: "Active",
					created_by: userId,
					pubToken,
					priToken,
				},
			])
			.select("goal_id")
			.single();

		if (goalError || !goalData) {
			throw goalError;
		}

		const goalId = goalData.goal_id;

		const { error: contributorError } = await supabase
			.from("contributors")
			.insert([
				{
					goal_id: goalId,
					user_id: userId,
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
