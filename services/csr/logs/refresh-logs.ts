import { Dispatch, SetStateAction } from "react";
import { GoalActiveState, WeeklyLogState, UserState } from "@/lib/types";
import { getLogs } from "@/services/ssr/logs/select-logs";
import { supabaseBrowser } from "@/lib/supabase/client";

interface RefreshLogsParams {
	user: UserState | null;
	goalState: GoalActiveState;
	showAlert: (status: number, message: string) => void;
	setLogState: Dispatch<SetStateAction<WeeklyLogState>>;
	goal_id?: string;
}

export const refreshLogsHandler = async ({
	goal_id,
	user,
	goalState,
	showAlert,
	setLogState,
}: RefreshLogsParams) => {
	if (user && (goalState.goal_id || goal_id)) {
		const { data, error } = await getLogs(
			user.user_id,
			goal_id || goalState.goal_id,
			supabaseBrowser,
		);

		if (error) {
			showAlert(500, error);
			return;
		}

		if (data) {
			setLogState((prev) => ({
				...prev,
				logs: data.logs,
				currentHours: data.currentHours,
			}));
		}
	} else {
		setLogState((prev) => ({
			...prev,
			logs: [],
			currentHours: 0,
		}));
	}
};
