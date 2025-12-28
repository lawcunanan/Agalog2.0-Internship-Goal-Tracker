"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HoursProgress } from "@/components/logs/hours-progress";
import { WeeklyLog } from "@/components/logs/weekly-log";
import { WeeklyLogState } from "@/lib/types";
import { LogForm } from "@/components/logs/log-form";

import { useAlert } from "@/providers/alert-provider";
import { useAuth } from "@/providers/auth-provider";
import { getLogs } from "@/services/logs/select-log";
import { getLatestGoal } from "@/services/goals/latest-goal";

export default function LogsPage() {
	const { showAlert } = useAlert();
	const { user, userDetails } = useAuth();

	const [goalId, setGoalId] = useState<string>("");
	const [logState, setLogState] = useState<WeeklyLogState>({
		logs: [],
		currentHours: 0,
		goalHours: 400,
		editLog: null,
	});

	const refreshLogs = async () => {
		if (user && goalId) {
			await getLogs(user.id, goalId, setLogState, showAlert);
		}
	};

	useEffect(() => {
		if (user) {
			getLatestGoal(user.id, setGoalId, setLogState, showAlert);
		}
	}, [user]);

	useEffect(() => {
		refreshLogs();
	}, [goalId]);

	return (
		<div className="min-h-screen flex flex-col relative md:overflow-hidden">
			<Header goalId={goalId} setGoalId={setGoalId} logState={logState} />
			<main className="flex-1 w-full max-w-300 mx-auto px-6 grid md:grid-cols-2 gap-20 h-screen ">
				<div className="flex flex-col pt-28 md:pt-42 w-full lg:max-w-md">
					<LogForm
						goal_id={goalId}
						editLog={logState.editLog}
						onEdit={(log) => setLogState((prev) => ({ ...prev, editLog: log }))}
						user={userDetails}
						showAlert={showAlert}
						refreshLogs={refreshLogs}
					/>
				</div>
				<div className="md:overflow-y-auto no-scrollbar pt-0 md:pt-42 ">
					<HoursProgress
						completed={logState.currentHours}
						required={logState.goalHours}
					/>
					<WeeklyLog
						data={logState.logs}
						onEdit={(log) => setLogState((prev) => ({ ...prev, editLog: log }))}
						showAlert={showAlert}
						refreshLogs={refreshLogs}
					/>
					<Footer />
				</div>
			</main>
		</div>
	);
}
