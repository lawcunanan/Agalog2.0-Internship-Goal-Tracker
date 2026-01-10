import { supabaseBrowser } from "@/lib/supabase/client";
import { GoalsState, Status } from "@/lib/types";

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

		const isAdmin = ["Super Admin", "Admin"].includes(role);

		let query = supabaseBrowser
			.from("user_goals_view")
			.select(
				`
				goal_id,
				title,
				goal,
				goal_status,
				contributor_status,
				created_at,
				created_by,
				sections,
				meta_text
				${isAdmin ? ', "pubToken", "priToken"' : ""}
				`,
			)
			.eq("user_id", userId)
			.eq("contributor_status", statusFilter);

		// 🔍 Search ONLY by title
		if (search?.trim()) {
			const keyword = `%${search.trim()}%`;
			query = query.ilike("title", keyword);
		}

		const { data, error } = await query.order("created_at", {
			ascending: false,
		});

		if (error) throw error;

		const goals: GoalsState[] = (data || []).map((row: any) => ({
			goal_id: row.goal_id,
			title: row.title,
			goal: row.goal,
			status: row.contributor_status,
			sections: row.sections,
			created_at: row.created_at,
			created_by: row.created_by,

			// admin-only fields
			pubToken: row.pubToken,
			priToken: row.priToken,

			metaText: row.meta_text,
		}));

		setGoals(goals);
	} catch (error: any) {
		showAlert(500, error.message || "Failed to fetch goals");
	}
};
