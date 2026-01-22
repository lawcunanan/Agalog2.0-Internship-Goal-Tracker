import { SupabaseClient } from "@supabase/supabase-js";
import { UserSelect, UserRole, Status } from "@/lib/types";
import { getUserRole } from "@/services/ssr/auth/get-role";
import { updateUserRoleMetadata } from "@/services/ssr/auth/update-role-metadata";

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

		let role = user.user_metadata?.role as UserRole | undefined;

		if (!role) {
			const { role: dbUserRole, error: roleError } = await getUserRole(
				supabase,
				user.id,
			);
			if (roleError || !dbUserRole) {
				console.log("getAuthValues roleError:", roleError || "Role not found");
				return { data: null, error: "Role not found" };
			}

			role = dbUserRole as UserRole;
			const { success, error: updateError } = await updateUserRoleMetadata(
				supabase,
				role,
			);
			if (!success) {
				console.log(
					"getAuthValues updateError:",
					updateError || "Failed to update role metadata",
				);
				return { data: null, error: "Failed to update role metadata" };
			}
		}

		const userDetails: UserSelect = {
			user_id: user.id,
			fullname: user.user_metadata?.full_name,
			status: user.user_metadata?.status as Status,
			email: user.email || "",
			role: role as UserRole,
			avatar_url: user.user_metadata?.avatar_url,
			createdAt: user.created_at,
		};

		return { data: userDetails, error: null };
	} catch (error: any) {
		console.log("getAuthValues error:", error.message || "Unexpected error");
		return { data: null, error: error.message || "Unexpected error" };
	}
};
