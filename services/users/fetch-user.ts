import { SupabaseClient } from "@supabase/supabase-js";
import { UserDetails } from "@/lib/types";

export const fetchUserDetails = async (supabase: SupabaseClient) => {
	try {
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			return { data: null, error: "User not authenticated" };
		}

		const { data, error } = await supabase
			.from("users")
			.select("*")
			.eq("user_id", user.id)
			.single();

		if (error) {
			return { data: null, error: error.message };
		}

		return { data: data as UserDetails, error: null };
	} catch (error: any) {
		console.error("Error fetching user details:", error);
		return {
			data: null,
			error: error.message || "An unexpected error occurred",
		};
	}
};
