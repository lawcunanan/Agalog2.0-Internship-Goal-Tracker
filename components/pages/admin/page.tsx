"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { StatsticsSelect, GoalActiveState, UserDataSelect } from "@/lib/types";
import { useAlert } from "@/providers/alert-provider";
import { StatCard } from "../../statistics/page";
import { CheckCircle2, LogIn, Users } from "lucide-react";
import { TitlePage } from "../../title-page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { GoalAdminTab } from "../../tables/admin-goal";
import { UserSummaryTab } from "../../tables/user-summary";
import { TodayLogsTab } from "../../tables/today-logs";

type AdminContentProps = {
	initialGoal: GoalActiveState | null;
	initialStats: StatsticsSelect;
	initialTodayLogs: UserDataSelect[];
	initialUserSummary: UserDataSelect[];
	initialAdminGoals: UserDataSelect[];
	initialCompanies: string[];
	initialSections: string[];
};
export function AdminContent({
	initialGoal,
	initialStats,
	initialTodayLogs,
	initialUserSummary,
	initialAdminGoals,
	initialCompanies,
	initialSections,
}: AdminContentProps) {
	const { showAlert } = useAlert();

	const [goalState, setGoalState] = useState<GoalActiveState>(
		initialGoal || {
			goal_id: "",
			goalHours: 400,
			sections: [],
		},
	);

	return (
		<div className="min-h-screen flex flex-col relative md:overflow-hidden">
			<Header goalState={goalState} setGoalState={setGoalState} />
			<main className="flex-1 w-full max-w-300 mx-auto p-6 pt-28 space-y-9">
				{/* Page Title and Description */}
				<TitlePage
					title="Admin Dashboard"
					description="Overview of platform statistics and user management."
				/>

				<div className="flex gap-4  overflow-x-auto">
					<StatCard
						title="New Logs Today"
						value={initialStats.todayLogs}
						color="bg-green-800"
						icon={<LogIn className="w-4 h-4 text-white" />}
					/>

					<StatCard
						title="Completed Goals"
						value={initialStats.completedGoals!}
						color="bg-blue-800"
						icon={<CheckCircle2 className="w-4 h-4 text-white" />}
					/>

					<StatCard
						title="Total Users"
						value={initialStats.totalUsers}
						color="bg-yellow-600"
						icon={<Users className="w-4 h-4 text-white" />}
					/>
					<StatCard
						title="Total Admin"
						value={initialStats.totalAdmins}
						color="bg-purple-700"
						icon={<Users className="w-4 h-4 text-white" />}
					/>
				</div>

				<Tabs defaultValue="today-logs" className="w-full">
					<TabsList className="flex w-full">
						<TabsTrigger value="today-logs" className="flex-1">
							Today Logs
						</TabsTrigger>
						<TabsTrigger value="user-summary" className="flex-1">
							Student Summary
						</TabsTrigger>
						<TabsTrigger value="goal-admin" className="flex-1">
							Goal Admin
						</TabsTrigger>
					</TabsList>

					<TabsContent value="today-logs">
						<TodayLogsTab
							role="Admin"
							goal_id={goalState.goal_id}
							showAlert={showAlert}
							initialData={initialTodayLogs}
							initialSections={initialSections}
						/>
					</TabsContent>

					<TabsContent value="user-summary">
						<UserSummaryTab
							goal_id={goalState.goal_id}
							showAlert={showAlert}
							initialData={initialUserSummary}
							initialCompanies={initialCompanies}
							initialSections={initialSections}
						/>
					</TabsContent>

					<TabsContent value="goal-admin">
						<GoalAdminTab
							goal_id={goalState.goal_id}
							showAlert={showAlert}
							initialData={initialAdminGoals}
						/>
					</TabsContent>
				</Tabs>

				<Footer />
			</main>
		</div>
	);
}
