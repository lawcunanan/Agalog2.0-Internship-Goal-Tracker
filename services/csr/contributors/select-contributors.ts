import { supabaseBrowser } from "@/lib/supabase/client";

export type GoalContributor = {
	user_id: string;
	fullname: string;
	email: string;
	avatar_url: string;
	role: string;
};

type ContributorJoinRow = {
	user_id: string;
	role: string | null;
	users:
		| {
				full_name: string | null;
				email: string | null;
				avatar_url: string | null;
		  }
		| {
				full_name: string | null;
				email: string | null;
				avatar_url: string | null;
		  }[]
		| null;
};

const pickUser = (u: ContributorJoinRow["users"]) =>
	Array.isArray(u) ? (u[0] ?? null) : u;

export const getGoalContributors = async (
	goalId: string,
): Promise<GoalContributor[]> => {
	if (!goalId) return [];

	const { data, error } = await supabaseBrowser
		.from("contributors")
		.select("user_id, role, users(full_name, email, avatar_url)")
		.eq("goal_id", goalId)
		.eq("status", "Active");

	if (error) {
		console.error("getGoalContributors error:", error.message);
		return [];
	}

	return ((data ?? []) as ContributorJoinRow[])
		.map((row) => {
			const u = pickUser(row.users);
			return {
				user_id: row.user_id,
				role: row.role ?? "",
				fullname: u?.full_name ?? "",
				email: u?.email ?? "",
				avatar_url: u?.avatar_url ?? "",
			};
		})
		.sort((a, b) => a.fullname.localeCompare(b.fullname));
};
