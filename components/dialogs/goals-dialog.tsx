"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
	AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Edit2,
	Copy,
	Trash2,
	X,
	CheckCircle,
	LogOut,
	Filter,
	Key,
} from "lucide-react";
import { EmptyState } from "@/components/empty-state/empty-state";
import { insertGoal } from "@/services/goals/insert-goal";
import { updateGoalDetails } from "@/services/goals/update-goal";
import { insertContributor } from "@/services/contributor/insert-contributor";
import { getUserGoals } from "@/services/goals/select-goal";
import { DeleteGoalDialog } from "./delete-goal-dialog";
import { LeaveGoalDialog } from "./leave-goal-dialog";
import {
	GoalSelect,
	GoalValues,
	ContributorValues,
	UserDetails,
	GoalActiveState,
} from "@/lib/types";

export function GoalsDialog({
	children,
	userId,
	goalState,
	setGoalState,
	userDetails,
	showAlert,
}: {
	children: React.ReactNode;
	userId?: string;
	userDetails?: UserDetails | null;
	goalState: GoalActiveState;
	setGoalState: (goalState: GoalActiveState) => void;
	showAlert: (status: number, message: string) => void;
}) {
	const [mode, setMode] = useState<"join" | "create">("join");
	const [goals, setGoals] = useState<GoalSelect[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [filterStatus, setFilterStatus] = useState<"Active" | "Inactive">(
		"Active",
	);
	const [isOpen, setIsOpen] = useState(false);
	const role = userDetails?.role || "Student";

	// Join
	const [contributor, setContributor] = useState<ContributorValues>({
		token: "",
		section: "",
		company: "",
	});

	// Create / Edit
	const [goalValues, setGoalValues] = useState<GoalValues>({
		goal_id: undefined,
		title: "",
		goal: 400,
	});

	const refreshGoals = () => {
		if (!userId) return;

		getUserGoals(
			userId,
			role || "Student",
			filterStatus || "Active",
			(data) => {
				data.length === 0
					? handleSetGoal("0", 400)
					: handleSetGoal(String(data[0].goal_id), data[0].goal);

				setGoals(data);
			},
			showAlert,
		);
	};

	useEffect(() => {
		if (isOpen) {
			setGoalValues({
				goal_id: undefined,
				title: "",
				goal: 400,
			});

			setContributor({
				token: "",
				section: "",
				company: "",
			});

			refreshGoals();
		}
	}, [userId, filterStatus, isOpen]);

	const handleFormChange = <T extends object>(
		setState: React.Dispatch<React.SetStateAction<T>>,
		key: keyof T,
		value: T[keyof T],
	) => {
		setState((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	const handleJoinGoal = async () => {
		if (!userId || !role) {
			showAlert(500, "User details missing");
			return;
		}

		if (
			!contributor.token.trim() ||
			(role === "Student" &&
				(!contributor.section?.trim() || !contributor.company?.trim()))
		) {
			showAlert(400, "Please enter all required fields");
			return;
		}

		await insertContributor(
			userId,
			role,
			{
				token: contributor.token,
				section: contributor.section,
				company: contributor.company,
			},
			showAlert,
			setIsLoading,
		);

		refreshGoals();
	};

	const handleGoal = async (action: "create" | "edit") => {
		if (!userId || !role) {
			showAlert(500, "User details missing");
			return;
		}
		if (
			!goalValues.title?.trim() ||
			goalValues.goal! <= 0 ||
			goalValues.goal! > 2000
		) {
			showAlert(400, "Invalid goal details");
			return;
		}

		if (action === "create") {
			await insertGoal(
				userId,
				role,
				{ title: goalValues.title, goal: goalValues.goal },
				showAlert,
				setIsLoading,
			);
		} else if (goalValues.goal_id) {
			await updateGoalDetails(
				{
					goal_id: goalValues.goal_id,
					title: goalValues.title,
					goal: goalValues.goal,
				},
				showAlert,
				setIsLoading,
			);
		}

		refreshGoals();
	};

	const handleEditGoal = (goal: GoalValues) => {
		setGoalValues({
			goal_id: goal.goal_id,
			title: goal.title,
			goal: goal.goal,
		});
		setMode("create");
	};

	const handleSetGoal = (goalId: string, goalHours?: number) => {
		setGoalState({
			...goalState,
			goal_id: goalId,
			goalHours:
				goalHours ||
				goals.find((g) => String(g.goal_id) === goalId)?.goal ||
				400,
		});
	};

	return (
		<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

			<AlertDialogContent className="sm:max-w-175">
				<AlertDialogHeader>
					<div className="flex items-center justify-between">
						<AlertDialogTitle>Manage Goals</AlertDialogTitle>
						<AlertDialogCancel className="bg-transparent! !hover:bg-transparent p-0! h-auto! w-auto! border-0! shadow-none! ring-0! outline-none!">
							<X className="h-4 w-4" />
						</AlertDialogCancel>
					</div>
					<AlertDialogDescription>
						Join or create internship goals.
					</AlertDialogDescription>
				</AlertDialogHeader>

				{/* MODE SWITCH */}
				<div className="flex gap-2 border-b rounded-b-none">
					<Button
						variant={mode === "join" ? "default" : "ghost"}
						onClick={() => setMode("join")}
						className="rounded-b-none"
					>
						Join Goal
					</Button>
					<Button
						variant={mode === "create" ? "default" : "ghost"}
						onClick={() => setMode("create")}
						className="rounded-b-none"
					>
						Create Goal
					</Button>
				</div>

				{/* JOIN */}
				{mode === "join" && (
					<div
						className={`flex gap-2 w-full  ${
							role === "Student" ? "flex-col sm:flex-row " : "flex-row"
						} items-stretch sm:items-end`}
					>
						<div className="relative w-full">
							<Key className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Enter goal token"
								className="pl-9"
								value={contributor.token}
								onChange={(e) =>
									handleFormChange(setContributor, "token", e.target.value)
								}
							/>
						</div>
						{role === "Student" && (
							<div className="flex gap-2 w-full">
								<Input
									placeholder="Enter section"
									value={contributor.section}
									onChange={(e) =>
										handleFormChange(setContributor, "section", e.target.value)
									}
									maxLength={30}
								/>
								<Input
									placeholder="Enter company"
									value={contributor.company}
									onChange={(e) =>
										handleFormChange(setContributor, "company", e.target.value)
									}
									maxLength={60}
								/>
							</div>
						)}

						<Button onClick={handleJoinGoal} disabled={isLoading}>
							{isLoading ? "Joining..." : "Join"}
						</Button>
					</div>
				)}

				{/* CREATE / EDIT */}
				{mode === "create" && (
					<div className="flex gap-2 items-end">
						<Input
							placeholder="Goal Title"
							value={goalValues.title}
							onChange={(e) =>
								handleFormChange(setGoalValues, "title", e.target.value)
							}
							maxLength={50}
						/>
						<Input
							type="number"
							value={goalValues.goal}
							onChange={(e) =>
								handleFormChange(setGoalValues, "goal", Number(e.target.value))
							}
							max={2000}
						/>
						<Button
							onClick={() => handleGoal(goalValues.goal_id ? "edit" : "create")}
							disabled={isLoading}
						>
							{goalValues.goal_id ? "Update" : "Create"}
						</Button>
					</div>
				)}

				{/* GOALS */}

				<div className="flex items-center justify-between">
					<Label className="text-sm font-medium">Your Goals 🌟</Label>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								size="icon"
								variant="ghost"
								className="h-8 w-8 bg-transparent"
							>
								<Filter className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => setFilterStatus("Active")}>
								{filterStatus === "Active" && "✓ "}Active
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setFilterStatus("Inactive")}>
								{filterStatus === "Inactive" && "✓ "}Inactive
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<div className="divide-y max-h-80 overflow-y-auto">
					{goals.length === 0 ? (
						<EmptyState
							title="No goals yet"
							description="Join an existing goal or create a new one to get started."
						/>
					) : (
						<RadioGroup
							value={goalState.goal_id}
							onValueChange={(value) => {
								handleSetGoal(value);
							}}
						>
							{goals.map((goal) => {
								const isSelected = goalState.goal_id === String(goal.goal_id);
								const isOwner = userId === goal.created_by;
								const isInactive = goal.status === "Inactive";
								const isAdmin = ["Admin", "Super Admin"].includes(role);

								return (
									<div
										key={goal.goal_id}
										className="pb-6 pr-2 flex gap-6 items-start"
									>
										<RadioGroupItem
											value={String(goal.goal_id)}
											className="mt-1"
										/>
										<div
											className="flex-1 cursor-pointer"
											onClick={() =>
												handleSetGoal(String(goal.goal_id), goal.goal)
											}
										>
											<p className="text-sm sm:text-base font-medium ">
												{goal.title.charAt(0).toUpperCase() +
													goal.title.slice(1)}
											</p>
											<p className="text-xs text-muted-foreground">
												{goal.metaText}
											</p>

											{isAdmin && (
												<div className="flex gap-2 mt-5">
													<Button
														size="sm"
														variant="outline"
														className="text-xs sm:text-sm"
														onClick={() => {
															navigator.clipboard.writeText(
																goal.priToken || "",
															);
															showAlert(200, "Private token copied");
														}}
													>
														<Copy className="h-3 w-3 mr-1" /> Private
													</Button>
													<Button
														size="sm"
														variant="outline"
														className="text-xs sm:text-sm"
														onClick={() => {
															navigator.clipboard.writeText(
																goal.pubToken || "",
															);
															showAlert(200, "Public token copied");
														}}
													>
														<Copy className="h-3 w-3 mr-1" /> Public
													</Button>
												</div>
											)}
										</div>

										{isSelected && (
											<div className="flex gap-2">
												{isOwner ? (
													<>
														<Button
															size="icon"
															variant="ghost"
															onClick={() => handleEditGoal(goal)}
														>
															<Edit2 className="h-4 w-4" />
														</Button>

														<DeleteGoalDialog
															userId={userId || ""}
															goalId={String(goal.goal_id)}
															targetStatus={isInactive ? "Active" : "Inactive"}
															showAlert={showAlert}
															refreshGoals={refreshGoals}
														>
															<Button
																size="icon"
																variant="ghost"
																className={
																	isInactive
																		? "text-green-500"
																		: "text-destructive"
																}
															>
																{isInactive ? (
																	<CheckCircle className="h-4 w-4" />
																) : (
																	<Trash2 className="h-4 w-4" />
																)}
															</Button>
														</DeleteGoalDialog>
													</>
												) : (
													<LeaveGoalDialog
														userId={userId || ""}
														goalId={String(goal.goal_id)}
														targetStatus={isInactive ? "Active" : "Inactive"}
														showAlert={showAlert}
														refreshGoals={refreshGoals}
													>
														<Button
															size="icon"
															variant="ghost"
															className={
																isInactive
																	? "text-green-500"
																	: "text-destructive"
															}
														>
															{isInactive ? (
																<CheckCircle className="h-4 w-4" />
															) : (
																<LogOut className="h-4 w-4" />
															)}
														</Button>
													</LeaveGoalDialog>
												)}
											</div>
										)}
									</div>
								);
							})}
						</RadioGroup>
					)}
				</div>
			</AlertDialogContent>
		</AlertDialog>
	);
}
