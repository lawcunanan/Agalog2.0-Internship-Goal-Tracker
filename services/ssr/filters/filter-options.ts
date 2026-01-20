import { SupabaseClient } from "@supabase/supabase-js";

type FilterOptionsResponse = {
	companies: string[] | null;
	sections: string[] | null;
	error: string | null;
};

export const getFilterOptions = async (
	supabase: SupabaseClient,
	goal_id: string | null,
): Promise<FilterOptionsResponse> => {
	try {
		let companies: string[] | null = null;

		if (goal_id) {
			let companyQuery = supabase
				.from("distinct_companies")
				.select("company")
				.eq("goal_id", goal_id);
			const { data: companyData, error: companyError } = await companyQuery;

			if (companyError) {
				console.error("getCompanies query error:", companyError.message);
				return { companies: null, sections: null, error: companyError.message };
			}

			const companySet = new Set<string>();
			(companyData ?? []).forEach((r: any) => {
				if (r.company && r.company.trim()) {
					const formattedCompany = (r.company as string)
						.trim()
						.toLowerCase()
						.replace(/\b\w/g, (char) => char.toUpperCase());
					companySet.add(formattedCompany);
				}
			});

			companies = Array.from(companySet).sort((a, b) => a.localeCompare(b));
			if (companies.length) companies.unshift("All Companies");
		}

		let sectionQuery = supabase.from("distinct_sections").select("section");
		if (goal_id) sectionQuery = sectionQuery.eq("goal_id", goal_id);

		const { data: sectionData, error: sectionError } = await sectionQuery;
		if (sectionError) {
			console.error("getSections query error:", sectionError.message);
			return { companies, sections: null, error: sectionError.message };
		}

		const sectionSet = new Set<string>();
		(sectionData ?? []).forEach((r: any) => {
			if (r.section && r.section.trim()) sectionSet.add(r.section.trim());
		});

		const sections = Array.from(sectionSet).sort((a, b) => a.localeCompare(b));
		if (sections.length) sections.unshift("All Sections");

		return { companies, sections, error: null };
	} catch (error: any) {
		console.error(
			"getFilterOptions unexpected error:",
			error.message || "Unexpected error",
		);
		return {
			companies: null,
			sections: null,
			error: error.message || "Unexpected error",
		};
	}
};
