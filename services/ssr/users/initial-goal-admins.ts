import { SupabaseClient } from "@supabase/supabase-js";
import { GoalAdminSelect, UserRole, Status, Paginated } from "@/lib/types";
import { formatPHDateTime } from "@/lib/utils/dateTimeUtils";
import { GoalAdminRow } from "@/lib/types-row";

export const getGoalAdmin = async (
	supabase: SupabaseClient,
	goalId: string | null,
	searchQuery: string,
	statusFilter: string,
	itemsPerPage: number,
	currentPage: number,
): Promise<Paginated<GoalAdminSelect>> => {
	try {
		const from = (currentPage - 1) * itemsPerPage;
		const to = from + itemsPerPage - 1;

		let query = supabase
			.from("admin_contributors")
			.select("*", { count: "exact" })
			.range(from, to)
			.order("full_name", { ascending: true });

		if (goalId) query = query.eq("goal_id", Number(goalId));
		if (statusFilter && statusFilter !== "All Status") {
			query = query.eq("status", statusFilter);
		}
		if (searchQuery) {
			query = query.ilike("full_name", `%${searchQuery}%`);
		}

		const { data, error, count } = await query.overrideTypes<
			GoalAdminRow[],
			{ merge: false }
		>();

		const mappedData: GoalAdminSelect[] = (data || []).map((item) => ({
			user_id: item.user_id,
			goalId: item.goal_id,
			fullname: item.full_name ?? "",
			email: item.email,
			avatar_url: item.avatar_url ?? "",
			role: item.role as UserRole,
			status: item.status as Status,
			createdAt: formatPHDateTime(item.created_at),
		}));

		const totalPages = Math.ceil((count || 0) / itemsPerPage);

		return {
			data: mappedData,
			totalPages,
			error: error?.message ?? null,
		};
	} catch (err: any) {
		console.error("getGoalAdmin unexpected error:", err);

		return {
			data: [],
			totalPages: 0,
			error: err?.message || "Unexpected error",
		};
	}
};
