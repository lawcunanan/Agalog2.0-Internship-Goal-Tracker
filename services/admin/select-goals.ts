import { supabase } from "@/lib/supabase";
import { GoalsSelect } from "@/lib/types";
import { format } from "date-fns";

export const getGoals = async (
	setGoals: React.Dispatch<React.SetStateAction<GoalsSelect[]>>,
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
		if (error) throw error;

		setTotalPages(Math.ceil((count || 0) / itemsPerPage));

		setGoals(
			(data || []).map((item: any) => ({
				goal_id: item.goal_id,
				title: item.title,
				goalHours: item.goal || 0,
				createdBy: item.users?.full_name || "N/A",
				createdDate: item.created_at
					? format(new Date(item.created_at), "MMM d, yyyy")
					: "--:--",
				status: item.status,
			})),
		);
	} catch (error: any) {
		console.error("Error fetching goals:", error);
		showAlert(500, error.message || "Failed to fetch goals");
	}
};
