"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { GoalActiveState } from "@/lib/types";

interface Props {
	initialGoal: GoalActiveState | null;
}

export function StudentContent({ initialGoal }: Props) {
	const [goalState, setGoalState] = useState<GoalActiveState>(() => {
		return (
			initialGoal ?? {
				goal_id: "",
				goalHours: 0,
			}
		);
	});

	return (
		<div className="min-h-screen bg-background pb-10">
			<Header goalState={goalState} setGoalState={setGoalState} />
			<main className="pt-24 max-w-300 mx-auto px-4">
				<h1 className="text-2xl font-bold mb-4">
					Student Page {goalState.goalHours}
				</h1>
			</main>
		</div>
	);
}
