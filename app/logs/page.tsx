"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HoursProgress } from "@/components/logs/hours-progress";
import { WeeklyAttendance } from "@/components/logs/weekly-attendance";
import { WeeklyAttendanceState } from "@/lib/types";
import { LogForm } from "@/components/logs/log-form";

import { useAlert } from "@/providers/alert-provider";
import { useAuth } from "@/providers/auth-provider";

export default function LogsPage() {
	const { showAlert } = useAlert();
	const { user, userDetails } = useAuth();

	const [selectedGoal, setSelectedGoal] = useState<string>("");
	const [attendanceState, setAttendanceState] = useState<WeeklyAttendanceState>(
		{
			logs: [],
			goalHours: 400,
			currentHours: 0,
			editLog: null,
		},
	);

	return (
		<div className="min-h-screen flex flex-col relative md:overflow-hidden">
			<Header selectedGoal={selectedGoal} setSelectedGoal={setSelectedGoal} />
			<main className="flex-1 w-full max-w-300 mx-auto px-6 grid md:grid-cols-2 gap-20 h-screen ">
				<div className="flex flex-col pt-28 md:pt-42 w-full lg:max-w-md">
					<LogForm
						editLog={attendanceState.editLog}
						user={userDetails}
						showAlert={showAlert}
					/>
				</div>
				<div className="md:overflow-y-auto no-scrollbar pt-0 md:pt-42 ">
					<HoursProgress completed={200.23} required={400} />
					<WeeklyAttendance
						data={attendanceState.logs}
						onEdit={(log) =>
							setAttendanceState((prev) => ({ ...prev, editLog: log }))
						}
					/>
					<Footer />
				</div>
			</main>
		</div>
	);
}
