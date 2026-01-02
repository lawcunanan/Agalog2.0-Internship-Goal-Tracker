"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HoursProgress } from "@/components/logs/hours-progress";
import { WeeklyLog } from "@/components/logs/weekly-log";
import { WeeklyLogState, GoalActiveState } from "@/lib/types";
import { LogForm } from "@/components/logs/log-form";

import { useAlert } from "@/providers/alert-provider";
import { useAuth } from "@/providers/auth-provider";
import { getLogs } from "@/services/logs/select-log";
import { getLatestGoal } from "@/services/goals/latest-goal";

export default function LogsPage() {
	const { showAlert } = useAlert();
	const { user, userDetails } = useAuth();

	const [goalState, setGoalState] = useState<GoalActiveState>({
		goal_id: "",
		goalHours: 400,
	});

	const [logState, setLogState] = useState<WeeklyLogState>({
		logs: [],
		currentHours: 0,
		editLog: null,
	});

	const refreshLogs = async () => {
		if (user && goalState.goal_id) {
			await getLogs(user.id, goalState.goal_id, setLogState, showAlert);
		}
	};

	useEffect(() => {
		if (user) {
			getLatestGoal(user.id, setGoalState, showAlert);
		}
	}, [user]);

	useEffect(() => {
		refreshLogs();
	}, [goalState.goal_id]);

	return (
		<div className="min-h-screen flex flex-col relative md:overflow-hidden">
			<Header
				goalState={goalState}
				setGoalState={setGoalState}
				logState={logState}
				goalHours={goalState.goalHours}
			/>
			<main className="flex-1 w-full max-w-300 mx-auto px-6 ">
				<div className="grid md:grid-cols-2 gap-20 h-screen ">
					<div className="flex flex-col pt-28 md:pt-42 w-full lg:max-w-md">
						<LogForm
							goal_id={goalState.goal_id}
							editLog={logState.editLog}
							onEdit={(log) =>
								setLogState((prev) => ({ ...prev, editLog: log }))
							}
							user={userDetails}
							showAlert={showAlert}
							refreshLogs={refreshLogs}
						/>
					</div>
					<div className="md:overflow-y-auto no-scrollbar pt-0 md:pt-42">
						<HoursProgress
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
