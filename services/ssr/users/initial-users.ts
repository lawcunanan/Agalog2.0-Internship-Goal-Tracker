import { SupabaseClient } from "@supabase/supabase-js";
import { UserDataSelect } from "@/lib/types";
import { format } from "date-fns";

type UserResponse = {
	data: UserDataSelect[] | null;
	totalPages: number;
	error: string | null;
};

export const getUsers = async (
	supabase: SupabaseClient,
	searchQuery: string,
	statusFilter: string,
	roleFilter: string,
	itemsPerPage: number,
	currentPage: number,
): Promise<UserResponse> => {
	try {
		const from = (currentPage - 1) * itemsPerPage;
		const to = from + itemsPerPage - 1;

		let query = supabase
			.from("users")
			.select("*", { count: "exact" })
			.range(from, to)
			.order("full_name", { ascending: true });

		// Search by name or email
		if (searchQuery) {
			query = query.or(
				`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`,
			);
		}

		// Filter by status
		if (statusFilter && statusFilter !== "All Status") {
			query = query.eq("status", statusFilter);
		}

		// Filter by role
		if (roleFilter && roleFilter !== "All Roles") {
			query = query.eq("role", roleFilter);
		}

		const { data, error, count } = await query;

		if (error) {
			console.error("getUsers query error:", error.message);
			return { data: null, totalPages: 0, error: error.message };
		}

		const mappedData: UserDataSelect[] =
			(data || []).map((item: any) => ({
				user_id: item.user_id,
				picture: item.avatar_url,
				fullname: item.full_name,
				email: item.email,
				status: item.status,
				role: item.role,
				createdAt: item.created_at
					? format(new Date(item.created_at), "MMM d, yyyy h:mm a")
					: "--:--",
			})) || [];

		const totalPages = Math.ceil((count || 0) / itemsPerPage);

		return { data: mappedData, totalPages, error: null };
	} catch (error: any) {
		console.error(
			"getUsers unexpected error:",
			error.message || "Unexpected error",
		);
		return {
			data: null,
			totalPages: 0,
			error: error.message || "Unexpected error",
		};
	}
};
