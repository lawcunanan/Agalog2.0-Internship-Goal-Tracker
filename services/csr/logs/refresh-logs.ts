import { Dispatch, SetStateAction } from "react";
import { GoalActiveState, WeeklyLogState, UserSelect } from "@/lib/types";
import { getLogs } from "@/services/ssr/logs/initial-logs";
import { supabaseBrowser } from "@/lib/supabase/client";

type RefreshLogsParams = {
	user_id: string;
	goalState: GoalActiveState;
	showAlert: (status: number, message: string) => void;
	setLogState: Dispatch<SetStateAction<WeeklyLogState>>;
	goal_id?: string;
};

export const refreshLogsHandler = async ({
	goal_id,
	user_id,
	goalState,
	showAlert,
	setLogState,
}: RefreshLogsParams) => {
	if (user_id && goal_id) {
		const { data, error } = await getLogs(
			user_id,
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
