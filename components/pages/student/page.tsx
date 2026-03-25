"use client";

import { useState, useCallback, useEffect } from "react";
import { X } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { GoalActiveState, WeeklyLogState } from "@/lib/types";
import { useAlert } from "@/providers/alert-provider";
import { useAuth } from "@/providers/auth-provider";
import { LogProgress } from "@/components/logs/log-progress";
import { WeeklyLog } from "@/components/logs/weekly-log";
import { LogForm } from "@/components/logs/log-form";
import { refreshLogsHandler } from "@/services/csr/logs/refresh-logs";

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
				company: "",
			}
		);
	});

	const [logState, setLogState] = useState<WeeklyLogState>({
		logs: logsData?.logs ?? [],
		currentHours: logsData?.currentHours ?? 0,
		editLog: null,
	});

	const [showUpdateCard, setShowUpdateCard] = useState(() => {
		if (typeof window !== "undefined") {
			return localStorage.getItem("dismiss-update-v1") !== "true";
		}
		return true;
	});

	const dismissUpdate = () => {
		setShowUpdateCard(false);
		localStorage.setItem("dismiss-update-v1", "true");
	};

	const isCompleted =
		logState.currentHours >= goalState.goalHours && goalState.goalHours > 0;

	useEffect(() => {
		if (isCompleted) {
			showAlert(
				200,
				"Congratulations! You have completed your internship goal!",
			);
		}
	}, [isCompleted, showAlert]);

	const refreshLogs = useCallback(
		async (goal_id?: string) => {
			if (!user) return;
			await refreshLogsHandler({
				goal_id: goal_id ?? goalState.goal_id,
				user_id: user.user_id,
				goalState,
				showAlert,
				setLogState,
			});
		},
		[user, goalState, showAlert],
	);

	return (
		<div className="no-print min-h-screen flex flex-col relative md:overflow-hidden">
			<Header
				goalState={goalState}
				setGoalState={setGoalState}
				logState={logState}
				refreshLogs={refreshLogs}
			/>
			<main className="flex-1 w-full max-w-300 mx-auto px-4 md:px-6">
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
							isCompleted={isCompleted}
						/>
					</div>
					<div className="md:overflow-y-auto no-scrollbar pt-0 md:pt-42 space-y-12 md:space-y-16">
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

			{showUpdateCard && (
				<div className="fixed bottom-4 left-4 z-50 max-w-xs bg-background border border-border rounded-lg shadow-lg p-4 animate-in slide-in-from-bottom-4">
					<div className="flex items-start justify-between gap-2">
						<div>
							<p className="text-sm font-semibold">What's New</p>
							<ul className="mt-1.5 text-xs text-muted-foreground space-y-1">
								<li>- Attach pictures on reports</li>
								<li>- Upload supervisor signature</li>
								<li>- Improved report export filenames</li>
							</ul>
						</div>
						<button
							onClick={dismissUpdate}
							className="text-muted-foreground hover:text-foreground shrink-0 mt-0.5"
						>
							<X className="h-4 w-4" />
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
