"use client";

import { useState, useEffect, use, useCallback } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { GoalActiveState, WeeklyLogState } from "@/lib/types";
import { useAlert } from "@/providers/alert-provider";
import { useAuth } from "@/providers/auth-provider";
import { LogProgress } from "@/components/logs/log-progress";
import { WeeklyLog } from "@/components/logs/weekly-log";
import { LogForm } from "@/components/logs/log-form";
import { getLogs } from "@/services/ssr/logs/select-logs";
import { supabaseBrowser } from "@/lib/supabase/client";

type StudentContentProps = {
	initialGoal: GoalActiveState | null;
	logsData: {
		logs: WeeklyLogState["logs"] | null;
		currentHours: number;
	} | null;
};

export function StudentContent({ initialGoal, logsData }: StudentContentProps) {
	const { showAlert } = useAlert();
	const { user } = useAuth();

	const [goalState, setGoalState] = useState<GoalActiveState>(() => {
		return (
			initialGoal ?? {
				goal_id: "",
				goalHours: 0,
			}
		);
	});

	const [logState, setLogState] = useState<WeeklyLogState>({
		logs: logsData?.logs ?? [],
		currentHours: logsData?.currentHours ?? 0,
		editLog: null,
	});

	const refreshLogs = useCallback(
		async (goal_id?: string) => {
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
		},
		[user, goalState.goal_id, showAlert],
	);

	return (
		<div className="min-h-screen flex flex-col relative md:overflow-hidden">
			<Header
				goalState={goalState}
				setGoalState={setGoalState}
				refreshLogs={refreshLogs}
			/>
			<main className="flex-1 w-full max-w-300 mx-auto px-6">
				<div className="grid md:grid-cols-2 gap-20 h-screen ">
					<div className="flex flex-col pt-28 md:pt-42 w-full lg:max-w-md">
						<LogForm
							goal_id={goalState.goal_id}
							editLog={logState.editLog}
							onEdit={(log) =>
								setLogState((prev) => ({ ...prev, editLog: log }))
							}
							user={user}
							showAlert={showAlert}
							refreshLogs={refreshLogs}
						/>
					</div>
					<div className="md:overflow-y-auto no-scrollbar pt-0 md:pt-42 space-y-16">
						<LogProgress
							completed={logState.currentHours}
							required={goalState.goalHours}
						/>
						<WeeklyLog
							data={logState.logs}
							onEdit={(log) =>
								setLogState((prev) => ({ ...prev, editLog: log }))
							}
							showAlert={showAlert}
							refreshLogs={refreshLogs}
						/>
						<Footer />
					</div>
				</div>
			</main>
		</div>
	);
}
