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
} from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { insertGoal } from "@/services/goals/insert-goal";
import { updateGoalDetails } from "@/services/goals/update-goal";
import { updateGoalStatus } from "@/services/goals/delete-goal";
import { insertContributor } from "@/services/contributor/insert-contributor";
import { getUserGoals } from "@/services/goals/select-goal";
import { leaveGoalAsContributor } from "@/services/contributor/leave-contributor";
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
			userDetails?.role || "Student",
			filterStatus || "Active",
			(data) => {
				setGoals(data);
				handleSetGoal(String(data[0].goal_id), data[0].goal);
			},
			showAlert,
		);
	};

	useEffect(() => {
		refreshGoals();
	}, [userId, filterStatus]);

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
		if (!userId || !userDetails?.role) {
			showAlert(500, "User details missing");
			return;
		}

		if (
			!contributor.token.trim() ||
			(userDetails?.role === "Student" &&
				(!contributor.section?.trim() || !contributor.company?.trim()))
		) {
			showAlert(400, "Please enter all required fields");
			return;
		}

		await insertContributor(
			userId,
			userDetails.role,
			{
				token: contributor.token,
				section: contributor.section,
				company: contributor.company,
			},
			showAlert,
			setIsLoading,
		);

		setContributor({
			token: "",
			section: "",
			company: "",
		});
		refreshGoals();
	};

	const handleGoal = async (action: "create" | "edit") => {
		if (!userId || !userDetails?.role) {
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
				userDetails.role,
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

		setGoalValues({
			goal_id: undefined,
			title: "",
			goal: 400,
		});
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

	const handleDeleteGoal = async (
		goalId: string,
		status: "Active" | "Inactive",
	) => {
		if (!userId) {
			showAlert(500, "User details missing");
			return;
		}

		await updateGoalStatus(userId, goalId, status, showAlert);
		refreshGoals();
	};

	const handleLeaveGoal = async (
		goalId: string,
		status: "Active" | "Inactive",
	) => {
		if (!userId) {
			showAlert(500, "User details missing");
			return;
		}

		await leaveGoalAsContributor(userId, goalId, status, showAlert);
		refreshGoals();
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
		<AlertDialog>
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
					<div className="flex gap-2 items-end">
						<Input
							placeholder="Enter goal token"
							value={contributor.token}
							onChange={(e) =>
								handleFormChange(setContributor, "token", e.target.value)
							}
						/>
						{userDetails?.role === "Student" && (
							<>
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
							</>
						)}

						<Button onClick={handleJoinGoal}>
							{isLoading ? "Joining..." : "Join"}
						</Button>
					</div>
				)}

				{/* CREATE / EDIT */}
				{mode === "create" && (
					<div className="flex gap-2 items-end">
						<Input
							placeholder="Title"
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
								const isAdmin = ["Admin", "Super Admin"].includes(
									userDetails?.role || "",
								);

								return (
									<div
										key={goal.goal_id}
										className="pb-6 pr-2  flex gap-6 items-start"
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
											<p className="font-medium ">
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

														<Button
															size="icon"
															variant="ghost"
															className={
																isInactive
																	? "text-green-500"
																	: "text-destructive"
															}
															onClick={() =>
																handleDeleteGoal(
																	goal.goal_id,
																	isInactive ? "Active" : "Inactive",
																)
															}
														>
															{isInactive ? (
																<CheckCircle className="h-4 w-4" />
															) : (
																<Trash2 className="h-4 w-4" />
															)}
														</Button>
													</>
												) : (
													<Button
														size="icon"
														variant="ghost"
														className={
															isInactive ? "text-green-500" : "text-destructive"
														}
														onClick={() =>
															handleLeaveGoal(
																goal.goal_id,
																isInactive ? "Active" : "Inactive",
															)
														}
													>
														{isInactive ? (
															<CheckCircle className="h-4 w-4" />
														) : (
															<LogOut className="h-4 w-4" />
														)}
													</Button>
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
