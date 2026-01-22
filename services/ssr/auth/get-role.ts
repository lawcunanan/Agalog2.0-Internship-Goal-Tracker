import { SupabaseClient } from "@supabase/supabase-js";
import { UserRole } from "@/lib/types";

export const getUserRole = async (
	supabase: SupabaseClient,
	user_id: string,
): Promise<{ role: UserRole | null; error: string | null }> => {
	try {
		const { data, error } = await supabase
			.from("users")
			.select("role")
			.eq("user_id", user_id)
			.single();

		if (error || !data) {
			console.log("getUserRole error:", error?.message || "Role not found");
			return { role: null, error: "Role not found" };
		}

		return { role: data.role as UserRole, error: null };
	} catch (error: any) {
		console.log("getUserRole error:", error.message || "Unexpected error");
		return { role: null, error: error.message || "Unexpected error" };
	}
};
