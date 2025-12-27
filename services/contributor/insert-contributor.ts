import { supabase } from "@/lib/supabase";

export const insertContributor = async (
	userId: string,
	role: "Student" | "Admin" | "Super Admin",
	values: { token: string; section?: string; company?: string },
	showAlert: (status: number, message: string) => void,
	setIsLoading: (loading: boolean) => void,
) => {
	setIsLoading(true);

	try {
		if (!userId) throw new Error("User ID is required");
		if (!values.token) throw new Error("Token is required");

		const tokenColumn = role === "Student" ? "pubToken" : "priToken";

		const { data: goalData, error: goalError } = await supabase
			.from("goals")
			.select("goal_id, created_by")
			.eq(tokenColumn, values.token)
			.eq("status", "Active")
			.neq("created_by", userId)
			.single();

		if (goalError || !goalData) {
			throw new Error("Invalid token, inactive goal, or you are the owner");
		}

		const goalId = goalData.goal_id;

		const { data: existingContributor, error: checkError } = await supabase
			.from("contributors")
			.select("contributor_id, status")
			.eq("goal_id", goalId)
			.eq("user_id", userId)
			.single();

		if (checkError && checkError.code !== "PGRST116") {
			throw checkError;
		}

		if (existingContributor) {
			// Reactivate existing contributor
			const { error: updateError } = await supabase
				.from("contributors")
				.update({
					status: "Active",
					section: values.section,
					company: values.company,
				})
				.eq("contributor_id", existingContributor.contributor_id);

			if (updateError) throw updateError;

			showAlert(200, "You are re-activated as a contributor for this goal");
		} else {
			// Insert new contributor
			const { error: contributorError } = await supabase
				.from("contributors")
				.insert([
					{
						goal_id: goalId,
						user_id: userId,
						status: "Active",
						role,
						section: values.section,
						company: values.company,
					},
				]);

			if (contributorError) throw contributorError;

			showAlert(200, "Successfully joined the goal");
		}
	} catch (error: any) {
		console.error("Insert contributor error:", error);
		showAlert(500, error.message || "Failed to join goal");
	} finally {
		setIsLoading(false);
	}
};
