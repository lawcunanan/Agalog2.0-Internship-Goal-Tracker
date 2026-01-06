import { supabase } from "@/lib/supabase";
import { UsersSelect } from "@/lib/types";
import { format } from "date-fns";

export const getUsers = async (
	setUsers: React.Dispatch<React.SetStateAction<UsersSelect[]>>,
	searchQuery: string,
	statusFilter: string,
	roleFilter: string,
	itemsPerPage: number,
	currentPage: number,
	setTotalPages: React.Dispatch<React.SetStateAction<number>>,
	showAlert: (status: number, message: string) => void,
) => {
	try {
		const from = (currentPage - 1) * itemsPerPage;
		const to = from + itemsPerPage - 1;

		let query = supabase
			.from("users")
			.select("*", { count: "exact" })
			.range(from, to)
			.order("full_name", { ascending: true });

		// Search by name
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
		if (error) throw error;

		setTotalPages(Math.ceil((count || 0) / itemsPerPage));

		setUsers(
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
			})),
		);
	} catch (error: any) {
		showAlert(500, error.message || "Failed to fetch users");
	}
};
