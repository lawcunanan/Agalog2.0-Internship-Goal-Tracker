import { supabaseBrowser } from "@/lib/supabase/client";
import { GoalsState, Status } from "@/lib/types";
import { UserGoalViewRow } from "@/lib/types-row";

export const getGoals = async (
	userId: string,
	role: string,
	search: string,
	statusFilter: Status,
	setGoals: (goals: GoalsState[]) => void,
	showAlert: (status: number, message: string) => void,
) => {
	try {
		if (!userId) throw new Error("User ID is required");

		const isAdmin = role === "Super Admin" || role === "Admin";

		// Build query
		let query = supabaseBrowser
			.from("user_goals_view")
			.select(
				`
				goal_id,
				title,
				goal,
				goal_status,
				contributor_status,
				company,
				created_at,
				created_by,
				sections,
				meta_text
				${isAdmin ? ", pubToken, priToken" : ""}
				`,
			)
			.eq("user_id", userId)
			.eq("contributor_status", statusFilter);

		if (search?.trim()) {
			query = query.ilike("title", `%${search.trim()}%`);
		}

		const { data, error } = await query
			.order("created_at", {
				ascending: false,
			})
			.overrideTypes<UserGoalViewRow[], { merge: false }>();

		if (error) throw error;

		// Map to frontend-friendly GoalsState
		const goals: GoalsState[] = data.map((row) => ({
			goal_id: row.goal_id,
			title: row.title,
			goal: row.goal,
			status: row.contributor_status,
			sections: row.sections ?? [],
			company: row.company ?? undefined,
			created_at: row.created_at,
			created_by: row.created_by ?? undefined,
			pubToken: isAdmin ? (row.pubToken ?? undefined) : undefined,
			priToken: isAdmin ? (row.priToken ?? undefined) : undefined,
			metaText: row.meta_text ?? "",
		}));
		setGoals(goals);
	} catch (error: unknown) {
		const message =
			error instanceof Error ? error.message : "Failed to fetch goals";
		showAlert(500, message);
	}
};
