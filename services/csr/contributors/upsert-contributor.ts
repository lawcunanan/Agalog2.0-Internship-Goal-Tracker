import { supabaseBrowser } from "@/lib/supabase/client";
import { GoalsState, UserRole } from "@/lib/types";

export const upsertContributor = async (
	user_id: string,
	goal_id: string,
	role: UserRole,
	values: GoalsState,
	showAlert: (status: number, message: string) => void,
	setIsLoading: (loading: boolean) => void,
) => {
	setIsLoading(true);

	try {
		const { data: existingContributor, error: checkError } =
			await supabaseBrowser
				.from("contributors")
				.select("contributor_id, status")
				.eq("goal_id", goal_id)
				.eq("user_id", user_id)
				.single();

		if (checkError && checkError.code !== "PGRST116") {
			throw checkError;
		}

		if (existingContributor) {
			// Reactivate existing contributor
			const { error: updateError } = await supabaseBrowser
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
			const { error: contributorError } = await supabaseBrowser
				.from("contributors")
				.insert([
					{
						goal_id: goal_id,
						user_id: user_id,
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
		showAlert(500, error.message || "Failed to join goal");
	} finally {
		setIsLoading(false);
	}
};
