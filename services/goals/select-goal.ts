import { supabase } from "@/lib/supabase";

export const getUserGoals = async (
	userId: string,
	role: string,
	statusFilter: "Active" | "Inactive",
	setGoals: (goals: any[]) => void,
	showAlert: (status: number, message: string) => void,
	setIsLoading: (loading: boolean) => void,
) => {
	setIsLoading(true);

	try {
		if (!userId) throw new Error("User ID is required");

		const isAdmin = ["Super Admin", "Admin"].includes(role);

		const { data, error } = await supabase
			.from("contributors")
			.select(
				`
				contributor_id,
				role,
				status,
				section,
				company,
				goals!inner (
					goal_id,
					title,
					goal,
					status,
					created_by,
					created_at
					${isAdmin ? ", pubToken, priToken" : ""}
				)
				`,
			)
			.eq("user_id", userId)
			.eq("status", statusFilter)
			.eq("goals.status", statusFilter)
			.order("created_at", { ascending: false });

		if (error) throw error;

		const goals = (data || [])
			.map((row: any) => {
				const goal = row.goals;
				if (!goal) return null;

				const metaParts = [
					`${goal.goal} hours`,
					row.section,
					row.company,
					goal.created_at
						? new Date(goal.created_at).toLocaleDateString()
						: null,
				].filter(Boolean);

				return {
					...goal,
					metaText: metaParts.join(" • "),
				};
			})
			.filter(Boolean);

		setGoals(goals);
	} catch (error: any) {
		console.error("Get user goals error:", error);
		showAlert(500, error.message || "Failed to fetch goals");
	} finally {
		setIsLoading(false);
	}
};
