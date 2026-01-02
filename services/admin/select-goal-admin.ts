import { supabase } from "@/lib/supabase";
import { GoalAdminSelect } from "@/lib/types";
import { format } from "date-fns";

export const getGoalAdmin = async (
	goalId: string | null,
	setGoalAdmin: React.Dispatch<React.SetStateAction<GoalAdminSelect[]>>,
	searchQuery: string,
	statusFilter: string,
	itemsPerPage: number,
	currentPage: number,
	setTotalPages: React.Dispatch<React.SetStateAction<number>>,
	showAlert: (status: number, message: string) => void,
) => {
	try {
		const from = (currentPage - 1) * itemsPerPage;
		const to = from + itemsPerPage - 1;

		// Base query from the view
		let query = supabase
			.from("admin_contributors")
			.select("*", { count: "exact" })
			.range(from, to)
			.order("full_name", { ascending: true });

		// Filter by goalId if provided
		if (goalId) {
			query = query.eq("goal_id", Number(goalId));
		}

		// Filter by contributor status
		if (statusFilter && statusFilter !== "All Status") {
			query = query.eq("status", statusFilter);
		}

		// Search by full_name
		if (searchQuery) {
			query = query.ilike("full_name", `%${searchQuery}%`);
		}

		const { data, error, count } = await query;
		if (error) throw error;

		// Set total pages
		setTotalPages(Math.ceil((count || 0) / itemsPerPage));

		// Map data to GoalAdminSelect[]
		setGoalAdmin(
			(data || []).map((item: any) => ({
				user_id: item.user_id,
				goalId: item.goal_id,
				fullname: item.full_name,
				email: item.email,
				picture: item.avatar_url,
				role: item.role,
				status: item.status,
				createdAt: format(new Date(item.created_at), "MMM d, yyyy"),
			})),
		);
	} catch (error: any) {
		console.error("Error fetching admin data:", error);
		showAlert(500, error.message || "Failed to fetch admin data");
	}
};
