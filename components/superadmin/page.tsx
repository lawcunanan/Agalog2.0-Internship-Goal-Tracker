"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { statsticsSelect, UserDataSelect } from "@/lib/types";
import { useAlert } from "@/providers/alert-provider";
import { useAuth } from "@/providers/auth-provider";
import { StatCard } from "../statistics/page";
import { LogIn, Users } from "lucide-react";
import { TitlePage } from "../title-page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { TodayLogsTab } from "../tables/today-logs";
import { GoalsTab } from "../tables/goals";
import { UsersTab } from "../tables/users";

type SuperadminContentProps = {
	initialStats: statsticsSelect;
	initialTodayLogs: UserDataSelect[];
	initialRegisteredGoals: UserDataSelect[];
	initialUsers: UserDataSelect[];
	initialSections: string[];
};

export function SuperadminContent({
	initialStats,
	initialTodayLogs,
	initialRegisteredGoals,
	initialUsers,
	initialSections,
}: SuperadminContentProps) {
	const { showAlert } = useAlert();
	const { user } = useAuth();

	return (
		<div className="min-h-screen flex flex-col relative md:overflow-hidden">
			<Header />
			<main className="flex-1 w-full max-w-300 mx-auto p-6 pt-28 space-y-9">
				<TitlePage
					title="Superadmin Dashboard"
					description="Overview of all users, registered goals, and platform statistics."
				/>

				<div className="flex gap-4 overflow-x-auto">
					<StatCard
						title="New Logs Today"
						value={initialStats.todayLogs}
						color="bg-green-800"
						icon={<LogIn className="w-4 h-4 text-white" />}
					/>
					<StatCard
						title="Total Students"
						value={initialStats.totalUsers}
						color="bg-yellow-600"
						icon={<Users className="w-4 h-4 text-white" />}
					/>
					<StatCard
						title="Total Admins"
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
						<TabsTrigger value="users" className="flex-1">
							Users
						</TabsTrigger>
						<TabsTrigger value="goals" className="flex-1">
							Goals
						</TabsTrigger>
					</TabsList>

					<TabsContent value="today-logs">
						<TodayLogsTab
							role="Super Admin"
							goal_id={null}
							goalSection={initialSections}
							showAlert={showAlert}
							initialData={initialTodayLogs}
							initialSections={initialSections}
						/>
					</TabsContent>

					<TabsContent value="users">
						<UsersTab showAlert={showAlert} initialData={initialUsers} />
					</TabsContent>

					<TabsContent value="goals">
						<GoalsTab
							showAlert={showAlert}
							initialData={initialRegisteredGoals}
						/>
					</TabsContent>
				</Tabs>
				<Footer />
			</main>
		</div>
	);
}
