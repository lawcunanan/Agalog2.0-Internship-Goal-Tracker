import { SupabaseClient } from "@supabase/supabase-js";
import { UserDataSelect } from "@/lib/types";
import { format } from "date-fns";

type RegisteredGoalsResponse = {
	data: UserDataSelect[] | null;
	totalPages: number;
	error: string | null;
};

export const getRegisteredGoals = async (
	supabase: SupabaseClient,
	searchQuery: string,
	statusFilter: string,
	itemsPerPage: number,
	currentPage: number,
): Promise<RegisteredGoalsResponse> => {
	try {
		const from = (currentPage - 1) * itemsPerPage;
		const to = from + itemsPerPage - 1;

		let query = supabase
			.from("goals")
			.select(
				`
				*,
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

		const { data, error, count } = await query;

		if (error) {
			console.error("getGoals query error:", error.message);
			return { data: null, totalPages: 0, error: error.message };
		}

		const mappedData: UserDataSelect[] =
			(data || []).map((item: any) => ({
				goal_id: item.goal_id,
				goalTitle: item.title,
				goalHours: item.goal || 0,
				createdBy: item.users?.full_name || "N/A",
				createdAt: item.created_at
					? format(new Date(item.created_at), "MMM d, yyyy h:mm a")
					: "--:--",
				status: item.status,
			})) || [];

		const totalPages = Math.ceil((count || 0) / itemsPerPage);

		return { data: mappedData, totalPages, error: null };
	} catch (error: any) {
		console.error(
			"getGoals unexpected error:",
			error.message || "Unexpected error",
		);
		return {
			data: null,
			totalPages: 0,
			error: error.message || "Unexpected error",
		};
	}
};
