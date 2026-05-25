import { supabaseBrowser } from "@/lib/supabase/client";

export type GoalContributor = {
	user_id: string;
	fullname: string;
	email: string;
	avatar_url: string;
};

export const getGoalContributors = async (
	goalId: string,
): Promise<GoalContributor[]> => {
	if (!goalId) return [];

	const { data, error } = await supabaseBrowser
		.from("admin_contributors")
		.select("user_id, full_name, email, avatar_url")
		.eq("goal_id", Number(goalId))
		.order("full_name", { ascending: true });

	if (error) {
		console.error("getGoalContributors error:", error.message);
		return [];
	}

	return (data ?? []).map((row) => ({
		user_id: row.user_id,
		fullname: row.full_name ?? "",
		email: row.email ?? "",
		avatar_url: row.avatar_url ?? "",
	}));
};
