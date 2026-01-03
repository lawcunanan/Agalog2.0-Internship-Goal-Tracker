"use client";

import { useState, useEffect } from "react";
import { Users, LogIn, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TodayLogsTab } from "@/components/admin/TodayLogsTab";
import { UserSummaryTab } from "@/components/admin/UserSummaryTab";
import { GoalAdminTab } from "@/components/admin/GoalAdminTab";
import { useAuth } from "@/providers/auth-provider";
import { useAlert } from "@/providers/alert-provider";
import { GoalActiveState } from "@/lib/types";
import { StatCard } from "@/components/admin/StatCard";
import { getCountTodayLogs } from "@/services/stats/count-today-logs";
import { getCountCompletedLogs } from "@/services/stats/count-completed-";
import { getCountUsers } from "@/services/stats/count-users";
import { getLatestGoal } from "@/services/goals/latest-goal";

export default function AdminPage() {
	const { user } = useAuth();
	const { showAlert } = useAlert();
	const [countStats, setCountStats] = useState<{
		todayLogs: number;
		completedGoals: number;
		totalUsers: number;
		totalAdmins: number;
	}>({
		todayLogs: 0,
		completedGoals: 0,
		totalUsers: 0,
		totalAdmins: 0,
	});

	const [goalState, setGoalState] = useState<GoalActiveState>({
		goal_id: "",
		goalHours: 400,
	});

	useEffect(() => {
		if (user) {
			getLatestGoal(user.id, setGoalState, showAlert);
		}
	}, [user]);

	useEffect(() => {
		if (!user || !goalState.goal_id) return;

		getCountTodayLogs(
			goalState.goal_id,
			(count) => setCountStats((prev) => ({ ...prev, todayLogs: count })),
			showAlert,
		);

		getCountCompletedLogs(
			goalState.goal_id,
			(count) => setCountStats((prev) => ({ ...prev, completedGoals: count })),
			showAlert,
		);

		getCountUsers(
			goalState.goal_id,
			"Student",
			"contributors",
			(count) => setCountStats((prev) => ({ ...prev, totalUsers: count })),
			showAlert,
		);

		getCountUsers(
			goalState.goal_id,
			"Admin",
			"contributors",
			(count) => setCountStats((prev) => ({ ...prev, totalAdmins: count })),
			showAlert,
		);
	}, [user, goalState.goal_id, showAlert]);

	return (
		<div className="min-h-screen flex flex-col relative md:overflow-hidden">
			<Header goalState={goalState} setGoalState={setGoalState} />
			<main className="flex-1 w-full max-w-300 mx-auto p-6 pt-28 ">
				<div className="mb-12">
					<h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
						Admin Dashboard
					</h1>
					<p className="text-muted-foreground text-base">
						Monitor and manage student attendance records
					</p>
				</div>

				<div className="flex gap-4 mb-14 overflow-x-auto">
					<StatCard
						title="New Logs Today"
						value={countStats.todayLogs}
						color="bg-green-800"
						icon={<LogIn className="w-4 h-4 text-white" />}
					/>

					<StatCard
						title="Completed Goals"
						value={countStats.completedGoals}
						color="bg-blue-800"
						icon={<CheckCircle2 className="w-4 h-4 text-white" />}
					/>

					<StatCard
						title="Total Users"
						value={countStats.totalUsers}
						color="bg-yellow-600"
						icon={<Users className="w-4 h-4 text-white" />}
					/>
					<StatCard
						title="Total Admin"
						value={countStats.totalAdmins}
						color="bg-purple-700"
						icon={<Users className="w-4 h-4 text-white" />}
					/>
				</div>

				<Tabs defaultValue="today-logs" className="w-full">
					<TabsList className="grid grid-cols-3 w-full">
						<TabsTrigger value="today-logs">Today Logs</TabsTrigger>
						<TabsTrigger value="user-summary">Student Summary</TabsTrigger>
						<TabsTrigger value="goal-admin">Goal Admin</TabsTrigger>
					</TabsList>

					<TabsContent value="today-logs">
						<TodayLogsTab
							role="Admin"
							goalId={goalState.goal_id}
							showAlert={showAlert}
						/>
					</TabsContent>

					<TabsContent value="user-summary">
						<UserSummaryTab goalId={goalState.goal_id} showAlert={showAlert} />
					</TabsContent>

					<TabsContent value="goal-admin">
						<GoalAdminTab goalId={goalState.goal_id} showAlert={showAlert} />
					</TabsContent>
				</Tabs>

				<Footer />
			</main>
		</div>
	);
}
