import { SupabaseClient } from "@supabase/supabase-js";
import { Status, UserRole, UserSelect } from "@/lib/types";
import { UserRow } from "@/lib/types-row";
import { formatPHDateTime } from "@/lib/utils/dateTimeUtils";

type UserResponse = {
	data: UserSelect[] | null;
	error: string | null;
};

export const getStudent = async (
	supabase: SupabaseClient,
	student_id: string,
): Promise<UserResponse> => {
	try {
		const { data, error } = await supabase
			.from("users")
			.select("user_id, full_name, email, avatar_url, role, status, created_at")
			.eq("user_id", student_id)
			.single()
			.overrideTypes<UserRow, { merge: false }>();

		if (error) {
			console.log("getStudent query error:", error.message);
			return { data: null, error: error.message };
		}

		const mappedData: UserSelect = {
			user_id: data.user_id,
			fullname: data.full_name ?? "",
			email: data.email ?? "",
			avatar_url: data.avatar_url ?? "",
			role: data.role as UserRole,
			status: data.status as Status,
			signature_url: "",
			createdAt: formatPHDateTime(data.created_at),
		};

		return { data: [mappedData], error: null };
	} catch (err: any) {
		console.error("getStudent error:", err.message ?? err);
		return { data: null, error: err.message ?? "Unexpected error" };
	}
};
