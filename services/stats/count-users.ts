import { supabase } from "@/lib/supabase";

export const getCountUsers = async (
	goalId: string | null,
	role?: "Admin" | "Student",
	collection?: "users" | "contributors",
	setCountUsers?: (count: number) => void,
	showAlert?: (status: number, message: string) => void,
) => {
	try {
		let query;

		// USERS collection
		if (collection === "users") {
			query = supabase
				.from("users")
				.select("user_id", { count: "exact", head: true });

			if (role) {
				query = query.eq("role", role);
			}
		}

		// CONTRIBUTORS collection
		if (collection === "contributors") {
			query = supabase
				.from("contributors")
				.select("contributor_id", { count: "exact", head: true })
				.eq("status", "Active");

			if (goalId) {
				query = query.eq("goal_id", goalId);
			}

			if (role) {
				query = query.eq("role", role);
			}
		}

		if (!query) return;

		const { count, error } = await query;
		if (error) throw error;

		setCountUsers?.(count || 0);
	} catch (error: any) {
		console.error("Error fetching users:", error);
		showAlert?.(500, error.message || "Failed to fetch users");
	}
};
