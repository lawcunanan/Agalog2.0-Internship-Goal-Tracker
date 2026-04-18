"use client";

import { FadeIn } from "@/components/ui/fade-in";
import { Progress } from "@/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { GoalActiveState, GoalsState, FilterGoalSelect } from "@/lib/types";

type LogProgressProps = {
	completed: number;
	required: number;
	description?: string;
	filterGoals?: FilterGoalSelect[];
	goalState?: GoalActiveState;
	setGoalState?: (goalState: GoalActiveState) => void;
	onExport?: () => void;
	exporting?: boolean;
};

export function LogProgress({
	completed,
	required,
	description = "Total hours completed vs required internship goal.",
	filterGoals,
	goalState,
	setGoalState,
	onExport,
	exporting,
}: LogProgressProps) {
	const percentage =
		required > 0 ? Math.min(100, (completed / required) * 100) : 0;
	const remaining = Math.max(0, required - completed);

	return (
		<FadeIn className=" space-y-4">
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
				<div className="flex items-baseline gap-3 text-4xl sm:text-5xl font-light text-muted-foreground">
					<span className="text-foreground font-medium">
						{completed.toFixed(2)}
					</span>
					<span>/</span>
					<span className="font-bold text-blue-700">{required}</span>
					<span className="text-base sm:text-2xl font-normal">Hours</span>
				</div>

				{filterGoals && filterGoals.length > 0 && goalState && setGoalState && (
					<div className="flex items-center gap-2">
						<Select
							value={goalState.goal_id}
							onValueChange={(goal_id) =>
								setGoalState({
									...goalState,
									goal_id,
									goalHours:
										filterGoals.find((g) => g.goal_id === goal_id)?.goalHours ||
										0,
								})
							}
						>
							<SelectTrigger className="w-50">
								<SelectValue placeholder="Select Goal" />
							</SelectTrigger>
							<SelectContent>
								{filterGoals.map((goal) => (
									<SelectItem key={goal.goal_id} value={goal.goal_id}>
										{goal.title}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Button
							variant="outline"
							size="icon"
							onClick={onExport}
							disabled={exporting}
						>
							{exporting ? (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							) : (
								<Download className="h-4 w-4" />
							)}
						</Button>
					</div>
				)}
			</div>

			<Progress value={percentage} className="h-3" />

			<div className="flex items-start justify-between gap-4">
				<p className="text-base text-muted-foreground">{description}</p>
				<p className="text-sm text-muted-foreground whitespace-nowrap">
					<span className="font-semibold text-foreground">
						{remaining.toFixed(2)}
					</span>{" "}
					hrs remaining
				</p>
			</div>
		</FadeIn>
	);
}
