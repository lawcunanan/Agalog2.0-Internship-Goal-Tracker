"use client";

import { useState } from "react";
import { Users, LogIn, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RealtimeLogsTab } from "@/components/admin/RealtimeLogsTab";
import { UserSummaryTab } from "@/components/admin/UserSummaryTab";
import { GoalAdminTab } from "@/components/admin/GoalAdminTab";
import { useAuth } from "@/providers/auth-provider";
import { useAlert } from "@/providers/alert-provider";
import { GoalActiveState } from "@/lib/types";
import { StatCard } from "@/components/admin/StatCard";

export default function AdminPage() {
	const { user } = useAuth();
	const { showAlert } = useAlert();

	const [goalState, setGoalState] = useState<GoalActiveState>({
		goal_id: "",
		goalHours: 400,
	});

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

				<div className="flex gap-4  mb-14">
					<StatCard
						title="New Logs Today"
						value={10}
						color="bg-green-800"
						icon={<LogIn className="w-4 h-4 text-white" />}
					/>

					<StatCard
						title="Completed Goals"
						value={10}
						color="bg-blue-800"
						icon={<CheckCircle2 className="w-4 h-4 text-white" />}
					/>

					<StatCard
						title="Total Users"
						value={10}
						color="bg-yellow-600"
						icon={<Users className="w-4 h-4 text-white" />}
					/>
					<StatCard
						title="Total Admin"
						value={10}
						color="bg-purple-700"
						icon={<Users className="w-4 h-4 text-white" />}
					/>
				</div>

				<Tabs defaultValue="realtime-logs" className="w-full">
					<TabsList className="grid grid-cols-3 w-full">
						<TabsTrigger value="realtime-logs">Realtime Logs</TabsTrigger>
						<TabsTrigger value="user-summary">User Summary</TabsTrigger>
						<TabsTrigger value="goal-admin">Goal Admin</TabsTrigger>
					</TabsList>

					<TabsContent value="realtime-logs">
						<RealtimeLogsTab />
					</TabsContent>

					<TabsContent value="user-summary">
						<UserSummaryTab />
					</TabsContent>

					<TabsContent value="goal-admin">
						<GoalAdminTab />
					</TabsContent>
				</Tabs>

				<Footer />
			</main>
		</div>
	);
}
