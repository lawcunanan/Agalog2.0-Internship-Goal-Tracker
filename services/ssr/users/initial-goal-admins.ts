import { SupabaseClient } from "@supabase/supabase-js";
import { GoalAdminSelect, UserRole, Status } from "@/lib/types";
import { format } from "date-fns";
import { GoalAdminRow } from "@/lib/types-row";

type GoalAdminResponse = {
	data: GoalAdminSelect[] | null;
	totalPages: number;
	error: string | null;
};

export const getGoalAdmin = async (
	supabase: SupabaseClient,
	goalId: string | null,
	searchQuery: string,
	statusFilter: string,
	itemsPerPage: number,
	currentPage: number,
): Promise<GoalAdminResponse> => {
	try {
		const from = (currentPage - 1) * itemsPerPage;
		const to = from + itemsPerPage - 1;

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

		const { data, error, count } = await query.overrideTypes<
			GoalAdminRow[],
			{ merge: false }
		>();

		if (error) {
			console.error("getGoalAdmin query error:", error.message);
			return { data: null, totalPages: 0, error: error.message };
		}

		const mappedData: GoalAdminSelect[] =
			(data || []).map((item) => ({
				user_id: item.user_id,
				goalId: item.goal_id,
				fullname: item.full_name ?? "",
				email: item.email,
				avatar_url: item.avatar_url ?? "",
				role: item.role as UserRole,
				status: item.status as Status,
				createdAt: format(new Date(item.created_at), "MMM d, yyyy h:mm a"),
			})) || [];

		const totalPages = Math.ceil((count || 0) / itemsPerPage);

		return { data: mappedData, totalPages, error: null };
	} catch (error: any) {
		console.error(
			"getGoalAdmin unexpected error:",
			error.message || "Unexpected error",
		);
		return {
			data: null,
			totalPages: 0,
			error: error.message || "Unexpected error",
		};
	}
};
