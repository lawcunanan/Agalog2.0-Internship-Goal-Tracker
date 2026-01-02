"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

import { useAuth } from "@/providers/auth-provider";
import { useAlert } from "@/providers/alert-provider";
import { StudentProfileHeader } from "@/components/logs/student-profile";
import { HoursProgress } from "@/components/logs/hours-progress";
import { WeeklyLogTable } from "@/components/logs/weekly-log-table";
import {
	StudentProfileSelect,
	GoalActiveState,
	GoalValues,
	WeeklyLogState,
} from "@/lib/types";

import { exportExcel } from "@/lib/utils/export-utils";
import { getLogs } from "@/services/logs/select-log";
import { getProfile } from "@/services/users/select-profile";

interface AdminPageProps {
	params: Promise<{ goalId: string; studentId: string }>;
}
export default function AdminPage({ params }: AdminPageProps) {
	const { goalId, studentId } = use(params);
	const { user } = useAuth();
	const router = useRouter();
	const { showAlert } = useAlert();

	const [studentDetails, setStudent] = useState<StudentProfileSelect | null>({
		user_id: "",
		name: "",
		email: "",
		section: "",
		company: "",
		picture: "",
	});

	const [goalState, setGoalState] = useState<GoalActiveState>({
		goal_id: "",
		goalHours: 400,
	});

	const [logState, setLogState] = useState<WeeklyLogState>({
		logs: [],
		currentHours: 0,
	});

	const [goals, setGoals] = useState<GoalValues[]>([]);

	const onExportClick = async () => {
		if (logState && studentDetails && goalState.goalHours) {
			await exportExcel(
				studentDetails.name!,
				logState,
				goalState.goalHours,
				showAlert,
			);
		}
	};

	useEffect(() => {
		setStudent((prev) => ({
			...prev,
			user_id: studentId,
		}));

		setGoalState((prev) => ({
			...prev,
			goal_id: goalId,
		}));

		const fetchProfile = async () => {
			if (studentId) {
				await getProfile(studentId, setStudent, showAlert);
			}
		};
		fetchProfile();
	}, [studentId, goalId]);

	useEffect(() => {
		const fetchLogs = async () => {
			if (studentId && goalState.goal_id) {
				await getLogs(studentId, goalState.goal_id, setLogState, showAlert);
			}
		};
		fetchLogs();
	}, [studentId, goalState.goal_id]);

	return (
		<div className="min-h-screen flex flex-col relative md:overflow-hidden">
			<Header />
			<main className="flex-1 w-full max-w-300 mx-auto p-6 pt-28  space-y-16">
				<div className="mb-12">
					{/* Back Button */}
					<button
						onClick={() => router.back()}
						className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
					>
						<ChevronLeft className="w-4 h-4" />
						Back to Attendance List
					</button>
				</div>

				<StudentProfileHeader student={studentDetails!} />

				<HoursProgress
					completed={logState.currentHours}
					required={400}
					goals={goals}
					goalState={goalState}
					setGoalState={setGoalState}
					onExport={onExportClick}
				/>
				<WeeklyLogTable data={logState.logs} />
				<Footer />
			</main>
		</div>
	);
}
