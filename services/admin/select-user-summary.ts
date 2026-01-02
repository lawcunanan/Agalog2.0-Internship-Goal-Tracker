import { supabase } from "@/lib/supabase";
import { UserSummarySelect } from "@/lib/types";
import { formatDuration } from "@/lib/utils/dateTimeUtils";

export const getUserSummary = async (
	goalId: string | null,
	setUserSummary: React.Dispatch<React.SetStateAction<UserSummarySelect[]>>,
	searchQuery: string,
	sectionFilter: string,
	companyFilter: string,
	itemsPerPage: number,
	currentPage: number,
	setTotalPages: React.Dispatch<React.SetStateAction<number>>,
	showAlert: (status: number, message: string) => void,
) => {
	try {
		const from = (currentPage - 1) * itemsPerPage;
		const to = from + itemsPerPage - 1;

		let query = supabase
			.from("user_summary")
			.select("*", { count: "exact" })
			.order("full_name", { ascending: false })
			.range(from, to);

		if (goalId) {
			query = query.eq("goal_id", goalId);
		}

		if (sectionFilter && sectionFilter !== "All Sections") {
			query = query.ilike("section", `%${sectionFilter}%`);
		}

		if (companyFilter && companyFilter !== "All Companies") {
			query = query.ilike("company", `%${companyFilter}%`);
		}

		if (searchQuery) {
			query = query.ilike("full_name", `%${searchQuery}%`);
		}

		const { data, error, count } = await query;
		if (error) throw error;

		// total pages
		setTotalPages(Math.ceil((count || 0) / itemsPerPage));

		// map Supabase data to your type
		setUserSummary(
			(data || []).map((item) => ({
				user_id: item.user_id,
				picture: item.avatar_url,
				fullname: item.full_name,
				section: item.section || "N/A",
				company: item.company || "N/A",
				goalTitle: item.title || "N/A",
				goalHours: item.goal || 0,
				totalHours: formatDuration(Number(item.total_hours) || 0),
				hoursLeft: formatDuration(Number(item.hours_left) || 0),
			})),
		);
	} catch (error: any) {
		showAlert(500, error.message || "Failed to fetch user summary");
	}
};
