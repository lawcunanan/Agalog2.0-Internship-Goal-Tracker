"use client";

import { Progress } from "@/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { GoalActiveState, GoalValues } from "@/lib/types";

interface HoursProgressProps {
	completed: number;
	required: number;
	description?: string;
	goals?: GoalValues[];
	goalState?: GoalActiveState;
	setGoalState?: (goalState: GoalActiveState) => void;
	onExport?: () => void;
}

export function HoursProgress({
	completed,
	required,
	description = "Total hours completed vs required internship goal.",
	goals,
	goalState,
	setGoalState,
	onExport,
}: HoursProgressProps) {
	const percentage =
		required > 0 ? Math.min(100, (completed / required) * 100) : 0;

	return (
		<div className="mb-16 space-y-4">
			<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
				<div className="flex items-baseline gap-3 text-3xl sm:text-5xl font-light text-muted-foreground">
					<span className="text-foreground font-medium">
						{completed.toFixed(2)}
					</span>
					<span>/</span>
					<span className="font-bold text-blue-700">{required}</span>
					<span className="text-2xl font-normal">Hours</span>
				</div>

				{goals && goalState && setGoalState && (
					<div className="flex items-center gap-2">
						<Select
							value={goalState.goal_id}
							onValueChange={(goal_id) =>
								setGoalState({ ...goalState, goal_id })
							}
						>
							<SelectTrigger className="w-50">
								<SelectValue placeholder="Select Goal" />
							</SelectTrigger>
							<SelectContent>
								{goals.map((goal) => (
									<SelectItem key={goal.goal_id} value={goal.goal_id!}>
										{goal.title}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Button variant="outline" size="icon" onClick={onExport}>
							<Download className="h-4 w-4" />
						</Button>
					</div>
				)}
			</div>

			<Progress value={percentage} className="h-3" />

			<p className="text-sm sm:text-base text-muted-foreground">
				{description}
			</p>
		</div>
	);
}
