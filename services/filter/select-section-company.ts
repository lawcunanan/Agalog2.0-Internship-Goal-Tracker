import { supabase } from "@/lib/supabase";

export const getSectionCompany = async (
	goalId: string | null,
	setSection?: React.Dispatch<React.SetStateAction<string[]>>,
	setCompany?: React.Dispatch<React.SetStateAction<string[]>>,
	showAlert?: (status: number, message: string) => void,
) => {
	try {
		let query = supabase
			.from("distinct_sections_companies")
			.select("section, company");

		if (goalId) {
			query = query.eq("goal_id", goalId);
		}

		const { data, error } = await query;
		if (error) throw error;

		const rows = data ?? [];

		if (setSection) {
			const sectionSet = new Set<string>();

			rows.forEach((r) => {
				if (r.section && r.section.trim()) {
					sectionSet.add(r.section.trim());
				}
			});

			const sections = Array.from(sectionSet).sort((a, b) =>
				a.localeCompare(b),
			);

			setSection(["All Sections", ...sections]);
		}

		if (setCompany) {
			const companySet = new Set<string>();

			rows.forEach((r) => {
				if (r.company && r.company.trim()) {
					companySet.add(r.company.trim());
				}
			});

			const companies = Array.from(companySet).sort((a, b) =>
				a.localeCompare(b),
			);

			setCompany(["All Companies", ...companies]);
		}
	} catch (error: any) {
		showAlert?.(500, error.message || "Failed to fetch section and company");
	}
};
