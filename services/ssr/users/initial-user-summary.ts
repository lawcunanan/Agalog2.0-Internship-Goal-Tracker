import { SupabaseClient } from "@supabase/supabase-js";
import { UserSummarySelect, Paginated } from "@/lib/types";
import { formatDuration } from "@/lib/utils/dateTimeUtils";
import { UserSummaryRow } from "@/lib/types-row";

export const getUserSummary = async (
	supabase: SupabaseClient,
	goalId: string | null,
	searchQuery: string,
	sectionFilter: string,
	companyFilter: string,
	itemsPerPage: number,
	currentPage: number,
): Promise<Paginated<UserSummarySelect>> => {
	try {
		const from = (currentPage - 1) * itemsPerPage;
		const to = from + itemsPerPage - 1;

		let query = supabase
			.from("user_summary")
			.select("*", { count: "exact" })
			.order("full_name", { ascending: false })
			.range(from, to);

		// Filters
		if (goalId) {
			query = query.eq("goal_id", goalId);
		}

		if (sectionFilter && sectionFilter !== "All Sections") {
			query = query.or(
				`section.ilike.%${sectionFilter}%,section.ilike.%${sectionFilter.replace(
					/\s+/g,
					"",
				)}%`,
			);
		}

		if (companyFilter && companyFilter !== "All Companies") {
			query = query.or(
				`company.ilike.%${companyFilter}%,company.ilike.%${companyFilter.replace(
					/\s+/g,
					"",
				)}%`,
			);
		}

		if (searchQuery) {
			query = query.ilike("full_name", `%${searchQuery}%`);
		}

		const { data, error, count } = await query.overrideTypes<
			UserSummaryRow[],
			{ merge: false }
		>();

		if (error) {
			console.error("getUserSummary query error:", error.message);
			return { data: [], totalPages: 0, error: error.message };
		}

		const mappedData: UserSummarySelect[] = (data || []).map((item) => ({
			user_id: item.user_id,
			avatar_url: item.avatar_url ?? "",
			fullname: item.full_name ?? "",
			section: item.section || "N/A",
			company: item.company || "N/A",
			goalTitle: item.title || "N/A",
			goalHours: item.goal || 0,
			totalHours: formatDuration(Number(item.total_hours) || 0),
			hoursLeft: formatDuration(Number(item.hours_left) || 0),
		}));

		const totalPages = Math.ceil((count || 0) / itemsPerPage);

		return {
			data: mappedData,
			totalPages,
			error: null,
		};
	} catch (err: any) {
		console.error("getUserSummary unexpected error:", err);

		return {
			data: [],
			totalPages: 0,
			error: err?.message || "Unexpected error",
		};
	}
};
