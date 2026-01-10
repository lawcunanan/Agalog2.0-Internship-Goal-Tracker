import { SupabaseClient } from "@supabase/supabase-js";
import { UserState, UserRole } from "@/lib/types";

export const getUser = async (supabase: SupabaseClient) => {
	try {
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser();

		if (error) {
			return null;
		}

		return user;
	} catch (error) {
		console.error("Unexpected error fetching user:", error);
		return null;
	}
};

export const getAuthValues = async (
	supabase: SupabaseClient,
): Promise<{ data: UserState | null; error: string | null }> => {
	try {
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser();

		if (error || !user) {
			console.log("getAuthValues error:", error?.message || "User not found");
			return { data: null, error: "User not found" };
		}

		const userDetails: UserState = {
			user_id: user.id,
			full_name: user.user_metadata?.full_name,
			email: user.email,
			role: user.user_metadata?.role as UserRole,
			avatar_url: user.user_metadata?.avatar_url,
		};

		return { data: userDetails, error: null };
	} catch (error: any) {
		console.log("getAuthValues error:", error.message || "Unexpected error");
		return { data: null, error: error.message || "Unexpected error" };
	}
};
