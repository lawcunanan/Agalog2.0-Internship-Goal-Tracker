import { SupabaseClient } from "@supabase/supabase-js";
import { UserSelect, UserRole, Status } from "@/lib/types";

export const getAuthValues = async (
	supabase: SupabaseClient,
): Promise<{ data: UserSelect | null; error: string | null }> => {
	try {
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser();

		if (error || !user) {
			console.log("getAuthValues error:", error?.message || "User not found");
			return { data: null, error: "User not found" };
		}

		const userDetails: UserSelect = {
			user_id: user.id,
			fullname: user.user_metadata?.full_name,
			status: user.user_metadata?.status as Status,
			email: user.email || "",
			role: user.user_metadata?.role as UserRole,
			avatar_url: user.user_metadata?.avatar_url,
			createdAt: user.created_at,
		};

		return { data: userDetails, error: null };
	} catch (error: any) {
		console.log("getAuthValues error:", error.message || "Unexpected error");
		return { data: null, error: error.message || "Unexpected error" };
	}
};
