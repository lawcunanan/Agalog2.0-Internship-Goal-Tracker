import { SupabaseClient } from "@supabase/supabase-js";

type CountUsersResponse = {
	data: number | null;
	error: string | null;
};

export const getCountUsers = async (
	supabase: SupabaseClient,
	goal_id: string | null,
	role?: "Admin" | "Student",
	collection?: "users" | "contributors",
): Promise<CountUsersResponse> => {
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

			if (goal_id) {
				query = query.eq("goal_id", goal_id);
			}

			if (role) {
				query = query.eq("role", role);
			}
		}

		if (!query) {
			console.log("getCountUsers error: Invalid collection");
			return { data: null, error: "Invalid collection" };
		}

		const { count, error } = await query;

		if (error) {
			console.log("getCountUsers error:", error.message);
			return { data: null, error: error.message };
		}

		return { data: count ?? 0, error: null };
	} catch (error: any) {
		console.log("getCountUsers error:", error.message || "Unexpected error");
		return {
			data: null,
			error: error.message || "Unexpected error",
		};
	}
};
