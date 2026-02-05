import { SupabaseClient } from "@supabase/supabase-js";
import { UserSelect, UserRole, Status } from "@/lib/types";
import { getUserRole } from "@/services/ssr/auth/get-role";
import { updateUserRoleMetadata } from "@/services/ssr/auth/update-role-metadata";

export const getAuthValues = async (
	supabase: SupabaseClient,
): Promise<{ data: UserSelect | null; error: string | null }> => {
	try {
		// Get the authenticated user
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser();

		if (error || !user) {
			console.log("getAuthValues error:", error?.message || "User not found");
			return { data: null, error: "User not found" };
		}

		// Fetch user record from 'users' table
		const { data: userRecord, error: userError } = await supabase
			.from("users")
			.select("*")
			.eq("user_id", user.id)
			.single();

		if (userError || !userRecord) {
			console.log(
				"getAuthValues userError:",
				userError?.message || "User record not found",
			);
			return { data: null, error: "User record not found" };
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
			fullname: userRecord.full_name,
			status: userRecord.status as Status,
			email: userRecord.email,
			role: role as UserRole,
			avatar_url: userRecord.avatar_url,
			signature_url: userRecord.signature_url,
			createdAt: userRecord.created_at,
		};

		return { data: userDetails, error: null };
	} catch (error: any) {
		console.log("getAuthValues error:", error.message || "Unexpected error");
		return { data: null, error: error.message || "Unexpected error" };
	}
};
