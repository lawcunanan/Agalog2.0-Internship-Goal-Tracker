import { SupabaseClient } from "@supabase/supabase-js";
import { RegisteredGoalSelect, Paginated } from "@/lib/types";
import { format } from "date-fns";
import { RegisteredGoalRow } from "@/lib/types-row";

export const getRegisteredGoals = async (
	supabase: SupabaseClient,
	searchQuery: string,
	statusFilter: string,
	itemsPerPage: number,
	currentPage: number,
): Promise<Paginated<RegisteredGoalSelect>> => {
	try {
		const from = (currentPage - 1) * itemsPerPage;
		const to = from + itemsPerPage - 1;

		let query = supabase
			.from("goals")
			.select(
				`
				goal_id,
				title,
				goal,
				created_at,
				status,
				created_by,
				users!goals_created_by_fkey (full_name)
			`,
				{ count: "exact" },
			)
			.range(from, to)
			.order("created_at", { ascending: false });

		// Filter by status
		if (statusFilter && statusFilter !== "All Status") {
			query = query.eq("status", statusFilter);
		}

		// Search by title
		if (searchQuery) {
			query = query.ilike("title", `%${searchQuery}%`);
		}

		const { data, error, count } = await query.overrideTypes<
			RegisteredGoalRow[],
			{ merge: false }
		>();

		if (error) {
			console.error("getRegisteredGoals query error:", error.message);
			return { data: [], totalPages: 0, error: error.message };
		}

		const mappedData: RegisteredGoalSelect[] = (data || []).map((item) => ({
			goal_id: item.goal_id,
			goalTitle: item.title,
			goalHours: item.goal || 0,
			createdBy: item.users?.full_name || "N/A",
			createdAt: item.created_at
				? format(new Date(item.created_at), "MMM d, yyyy h:mm a")
				: "--:--",
			status: item.status,
		}));

		const totalPages = Math.ceil((count || 0) / itemsPerPage);

		return {
			data: mappedData,
			totalPages,
			error: null,
		};
	} catch (err: any) {
		console.error("getRegisteredGoals unexpected error:", err);
		return {
			data: [],
			totalPages: 0,
			error: err?.message || "Unexpected error",
		};
	}
};
