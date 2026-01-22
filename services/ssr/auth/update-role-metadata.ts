import { SupabaseClient } from "@supabase/supabase-js";
import { UserRole } from "@/lib/types";

export const updateUserRoleMetadata = async (
	supabase: SupabaseClient,
	role: UserRole,
): Promise<{ success: boolean; error: string | null }> => {
	try {
		const { error: updateError } = await supabase.auth.updateUser({
			data: { role },
		});

		if (updateError) {
			console.log("Failed to update metadata:", updateError.message);
			return { success: false, error: updateError.message };
		}

		const { error: refreshError } = await supabase.auth.refreshSession();
		if (refreshError) {
			console.log("Failed to refresh session:", refreshError.message);
			return { success: false, error: refreshError.message };
		}

		return { success: true, error: null };
	} catch (error: any) {
		console.log(
			"updateUserRoleMetadata error:",
			error.message || "Unexpected error",
		);
		return { success: false, error: error.message || "Unexpected error" };
	}
};
