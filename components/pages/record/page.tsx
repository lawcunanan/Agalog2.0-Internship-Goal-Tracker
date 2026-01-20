"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useAlert } from "@/providers/alert-provider";
import { ChevronLeft } from "lucide-react";

import {
	UserSelect,
	FilterGoalSelect,
	WeeklyLogState,
	GoalActiveState,
} from "@/lib/types";

import { LogProgress } from "@/components/logs/log-progress";
import { WeeklyLogTable } from "@/components/logs/weekly-log-table";
import { StudentProfileHeader } from "@/components/logs/log-profile";
import { exportLog } from "@/lib/utils/export-log";
import { refreshLogsHandler } from "@/services/csr/logs/refresh-logs";

type RecordContentProps = {
	targetStudentId: string;
	initialStudent: UserSelect | null;
	initialGoalActiveState: GoalActiveState | null;
	initialGoals: FilterGoalSelect[];
	initialLogsData: WeeklyLogState;
};

export function RecordContent({
	targetStudentId,
	initialStudent,
	initialGoalActiveState,
	initialGoals,
	initialLogsData,
}: RecordContentProps) {
	const router = useRouter();
	const { showAlert } = useAlert();

	const [isLoading, setIsLoading] = useState(false);
	const [student, setStudent] = useState<UserSelect | null>(initialStudent);
	const [goalState, setGoalState] = useState<GoalActiveState | null>(
		initialGoalActiveState,
	);
	const [logState, setLogState] = useState<WeeklyLogState>(initialLogsData);

	const isFirstLoadRef = useRef(true);

	const refreshLogs = useCallback(async () => {
		if (isFirstLoadRef.current) {
			isFirstLoadRef.current = false;
			return;
		}

		if (targetStudentId && goalState) {
			await refreshLogsHandler({
				goal_id: goalState.goal_id,
				user_id: targetStudentId,
				goalState,
				showAlert,
				setLogState,
			});

			const selectedGoal = initialGoals.find(
				(goal) => goal.goal_id === goalState.goal_id,
			);
			if (selectedGoal) {
				setStudent((prev) =>
					prev
						? {
								...prev,
								section: selectedGoal.section || undefined,
								company: selectedGoal.company || undefined,
							}
						: prev,
				);
			}
		}
	}, [goalState, targetStudentId, showAlert, initialGoals]);

	const onExportClick = async () => {
		if (logState && student && goalState?.goalHours) {
			await exportLog(
				student.fullname,
				logState,
				goalState.goalHours,
				showAlert,
				setIsLoading,
			);
		}
	};

	useEffect(() => {
		refreshLogs();
	}, [refreshLogs]);

	return (
		<div className="min-h-screen flex flex-col relative md:overflow-hidden">
			<Header goalState={goalState || undefined} setGoalState={setGoalState} />
			<main className="flex-1 w-full max-w-300 mx-auto p-6 pt-28 ">
				{/* Back Button */}
				<button
					onClick={() => router.back()}
					className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2 cursor-pointer"
				>
					<ChevronLeft className="w-4 h-4" />
					Back to Previous Page
				</button>

				<div className="space-y-12 md:space-y-16">
					<StudentProfileHeader student={student!} />

					{logState.logs.length > 0 && (
						<LogProgress
							completed={logState.currentHours}
							required={goalState?.goalHours || 0}
							filterGoals={initialGoals}
							goalState={goalState || undefined}
							setGoalState={setGoalState}
							onExport={onExportClick}
							exporting={isLoading}
						/>
					)}

					<WeeklyLogTable data={logState.logs} />
					<Footer />
				</div>
			</main>
		</div>
	);
}
