"use client";

import { useState, useEffect, use } from "react";
import { Users, LogIn, ShieldCheck } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TodayLogsTab } from "@/components/admin/TodayLogsTab";
import { UsersTab } from "@/components/admin/UsersTab";
import { GoalsTab } from "@/components/admin/GoalsTab";
import { StatCard } from "@/components/admin/StatCard";
import { useAlert } from "@/providers/alert-provider";
import { getCountTodayLogs } from "@/services/stats/count-today-logs";
import { getCountUsers } from "@/services/stats/count-users";

export default function SuperAdminPage() {
	const { showAlert } = useAlert();
	const [countStats, setCountStats] = useState<{
		todayLogs: number;
		totalUsers: number;
		totalAdmins: number;
	}>({
		todayLogs: 0,
		totalUsers: 0,
		totalAdmins: 0,
	});

	useEffect(() => {
		getCountTodayLogs(
			null,
			(count) => setCountStats((prev) => ({ ...prev, todayLogs: count })),
			showAlert,
		);

		getCountUsers(
			null,
			"Student",
			"users",
			(count) => setCountStats((prev) => ({ ...prev, totalUsers: count })),
			showAlert,
		);
		getCountUsers(
			null,
			"Admin",
			"users",
			(count) => setCountStats((prev) => ({ ...prev, totalAdmins: count })),
			showAlert,
		);
	}, [showAlert]);

	return (
		<div className="min-h-screen flex flex-col relative md:overflow-hidden">
			<Header />
			<main className="flex-1 w-full max-w-300 mx-auto p-6 pt-28 ">
				<div className="mb-12">
					<h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
						Super Admin Dashboard
					</h1>
					<p className="text-muted-foreground text-base">
						Monitor and manage all student and admin records
					</p>
				</div>

				<div className="flex gap-4 mb-14">
					<StatCard
						title="Today's Logs"
						value={countStats.todayLogs}
						color="bg-green-800"
						icon={<LogIn className="w-4 h-4 text-white" />}
					/>
					<StatCard
						title="Number of Students"
						value={countStats.totalUsers}
						color="bg-blue-800"
						icon={<Users className="w-4 h-4 text-white" />}
					/>
					<StatCard
						title="Number of Admin"
						value={countStats.totalAdmins}
						color="bg-purple-700"
						icon={<ShieldCheck className="w-4 h-4 text-white" />}
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
							goalId={null}
							showAlert={showAlert}
						/>
					</TabsContent>

					<TabsContent value="users">
						<UsersTab showAlert={showAlert} />
					</TabsContent>

					<TabsContent value="goals">
						<GoalsTab showAlert={showAlert} />
					</TabsContent>
				</Tabs>

				<Footer />
			</main>
		</div>
	);
}
