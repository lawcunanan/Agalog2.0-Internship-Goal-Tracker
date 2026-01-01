"use client";

import { useState } from "react";
import { Users, LogIn, ShieldCheck } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RealtimeLogsTab } from "@/components/admin/RealtimeLogsTab";
import { UsersTab } from "@/components/admin/UsersTab";
import { GoalsTab } from "@/components/admin/GoalsTab";
import { StatCard } from "@/components/admin/StatCard";
import { useAlert } from "@/providers/alert-provider";

export default function SuperAdminPage() {
	const { showAlert } = useAlert();
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
						value={25}
						color="bg-green-800"
						icon={<LogIn className="w-4 h-4 text-white" />}
					/>
					<StatCard
						title="Number of Students"
						value={120}
						color="bg-blue-800"
						icon={<Users className="w-4 h-4 text-white" />}
					/>
					<StatCard
						title="Number of Admin"
						value={8}
						color="bg-purple-700"
						icon={<ShieldCheck className="w-4 h-4 text-white" />}
					/>
				</div>

				<Tabs defaultValue="realtime-logs" className="w-full">
					<TabsList className="grid grid-cols-3 w-full">
						<TabsTrigger value="realtime-logs">Realtime Logs</TabsTrigger>
						<TabsTrigger value="users">Users</TabsTrigger>
						<TabsTrigger value="goals">Goals</TabsTrigger>
					</TabsList>

					<TabsContent value="realtime-logs">
						<RealtimeLogsTab goalId={null} showAlert={showAlert} />
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
