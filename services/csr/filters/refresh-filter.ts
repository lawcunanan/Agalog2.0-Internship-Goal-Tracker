import { Dispatch, SetStateAction } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { getFilterOptions } from "@/services/ssr/filters/filter-options";

type RefreshFiltersParams = {
	goal_id: string | null;
	setCompanies: Dispatch<SetStateAction<string[]>>;
	setSections: Dispatch<SetStateAction<string[]>>;
	showAlert?: (status: number, message: string) => void;
};

export const refreshFilters = async ({
	goal_id,
	setCompanies,
	setSections,
	showAlert,
}: RefreshFiltersParams) => {
	try {
		const { companies, sections, error } = await getFilterOptions(
			supabaseBrowser,
			goal_id,
		);

		if (error) {
			if (showAlert) showAlert(500, error);
			return;
		}

		if (companies) setCompanies(companies);
		if (sections) setSections(sections);
	} catch (error: any) {
		console.error("refreshFilters error:", error);
		if (showAlert) {
			showAlert(500, "Failed to refresh filter options");
		}
	}
};
