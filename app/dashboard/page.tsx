"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useAuth } from "@/providers/auth-provider";
import { useAlert } from "@/providers/alert-provider";
import { GoalActiveState } from "@/lib/types";

export default function DashboardPage() {
	const { user } = useAuth();
	const { showAlert } = useAlert();

	const [goalState, setGoalState] = useState<GoalActiveState>({
		goal_id: "",
		goalHours: 400,
	});

	return (
		<main className="min-h-screen flex flex-col">
			<Header goalState={goalState} setGoalState={setGoalState} />

			<div className="flex-1 p-4 pt-24 flex flex-col items-center">
				<div className="max-w-3xl w-full space-y-4">
					<h1 className="text-2xl font-bold">Temp Log Inserter</h1>
				</div>
			</div>

			<Footer />
		</main>
	);
}
