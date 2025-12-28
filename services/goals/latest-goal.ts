import { supabase } from "@/lib/supabase";
import { WeeklyLogState } from "@/lib/types";

export const getLatestGoal = async (
	userId: string,
	setGoalId: React.Dispatch<React.SetStateAction<string>>,
	setAttendanceState: React.Dispatch<React.SetStateAction<WeeklyLogState>>,
	showAlert: (status: number, message: string) => void,
) => {
	try {
		if (!userId) throw new Error("User ID is required");

		const { data, error } = await supabase
			.from("contributors")
			.select(
				`
				goals!inner (
					goal_id,
					goal,
					status
				)
			`,
			)
			.eq("user_id", userId)
			.eq("status", "Active")
			.eq("goals.status", "Active")
			.order("created_at", { ascending: false })
			.limit(1);

		if (error) throw error;

		if (!data || data.length === 0 || !data[0].goals) {
			showAlert(404, "No active goal found");
			return;
		}

		const latestGoal = Array.isArray(data[0].goals)
			? data[0].goals[0]
			: data[0].goals;

		setGoalId(latestGoal.goal_id?.toString() || "");
		setAttendanceState((prev) => ({
			...prev,
			goalHours: latestGoal.goal || 400,
		}));
	} catch (error: any) {
		console.error("Error fetching latest goal:", error);
		showAlert(500, error.message || "Failed to fetch latest goal");
	}
};
