"use client";

import { useState, useEffect, useCallback } from "react";
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
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Edit2,
	Trash2,
	X,
	CheckCircle2,
	Plus,
	Copy,
	Filter,
	MoreVertical,
	Search,
	Settings,
} from "lucide-react";
import { LoadingButtonText } from "@/components/ui/loading-button-text";
import { UserState, GoalsState, Status, GoalActiveState } from "@/lib/types";
import { handleFormChange } from "@/lib/utils";
import { LeaveGoalDialog } from "../contributors/leave-dialog";
import { StatusDialog } from "./status-dialog";

import { insertGoal } from "@/services/csr/goals/insert-goal";
import { updateGoal } from "@/services/csr/goals/update-goal";
import { getGoals } from "@/services/csr/goals/select-goals";

type ManageGoalsDialogProps = {
	user: UserState;
	goalState: GoalActiveState;
	setGoalState: (goalState: GoalActiveState) => void;
	showAlert: (status: number, message: string) => void;
	refreshLogs: (goalId?: string) => void;
};

export function ManageGoalsDialog({
	user,
	goalState,
	setGoalState,
	showAlert,
	refreshLogs,
}: ManageGoalsDialogProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [tab, setTab] = useState<"create" | "manage">("create");
	const [isLoading, setIsLoading] = useState(false);
	const [goalValues, setGoalValues] = useState<GoalsState>({
		goal_id: "",
		title: "",
		goal: 0,
		sections: [],
	});
	const [goals, setGoals] = useState<GoalsState[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [filterStatus, setFilterStatus] = useState<Status>("Active");

	const isStudent = user?.role === "Student";
	const requiredValues =
		!goalValues?.title ||
		!goalValues?.goal ||
		(!isStudent && !goalValues?.sections?.length);

	const fetchGoals = useCallback(async () => {
		if (!user) return;

		await getGoals(
			user.user_id,
			user.role || "Student",
			searchQuery,
			filterStatus,
			(data) => {
				if (data.length === 0) {
					handleSetGoalState("", 0);
				} else if (!data.find((g) => g.goal_id == goalState.goal_id)) {
					handleSetGoalState(String(data[0].goal_id), data[0].goal);
				}

				setGoals(data);
			},
			showAlert,
		);
	}, [user, searchQuery, filterStatus, goalState.goal_id, showAlert]);

	const handleCreateGoal = async () => {
		if (!user) return showAlert(500, "User not found.");
		if (requiredValues)
			return showAlert(300, "Please fill in all required fields.");

		if (goalValues.goal < 50)
			return showAlert(300, "Goal hours must be at least 50 hours.");
		if (goalValues.goal > 1000)
			return showAlert(300, "Goal hours cannot exceed 1000 hours.");

		if (goalValues.goal_id) {
			await updateGoal(goalValues, showAlert, setIsLoading);
		} else {
			await insertGoal(
				user.user_id,
				user.role || "Student",
				goalValues,
				showAlert,
				setIsLoading,
			);
		}
		fetchGoals();
		handleResetForm();
	};

	const handleSection = (type: "add" | "remove", value?: string) => {
		setGoalValues((prev) => {
			const currentSections = prev.sections || [];

			if (type === "add") {
				const newSection = prev.section;
				if (!newSection || newSection.trim() === "") return prev;
				if (currentSections.includes(newSection)) return prev;

				return {
					...prev,
					sections: [...currentSections, newSection],
					section: "",
				};
			}

			if (type === "remove" && value) {
				return {
					...prev,
					sections: currentSections.filter((s) => s !== value),
				};
			}

			return prev;
		});
	};

	const handleEditGoal = (goal: GoalsState) => {
		setGoalValues(goal);
		setTab("create");
	};

	const handleCopy = async (text: string) => {
		navigator.clipboard.writeText(text);
		showAlert(200, "Token copied to clipboard.");
	};

	const handleResetForm = () => {
		setGoalValues({
			goal_id: "",
			title: "",
			goal: 0,
			sections: [],
		});

		setTab("manage");
	};

	const handleSetGoalState = (goalId: string, goalHours?: number) => {
		refreshLogs(goalId);
		const goal = goals.find((g) => g.goal_id == goalId);
		setGoalState({
			...goalState,
			goal_id: goalId,
			goalHours: goalHours || goal?.goal || 0,
		});
	};

	useEffect(() => {
		if (isOpen) fetchGoals();
	}, [isOpen, fetchGoals]);

	return (
		<AlertDialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
			<AlertDialogTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className="w-full justify-start cursor-pointer gap-2"
				>
					<Settings className="h-4 w-4" />
					Manage Goal
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
				<AlertDialogHeader>
					<div className="flex items-center justify-between">
						<AlertDialogTitle>Manage Internship Goals</AlertDialogTitle>
						<AlertDialogCancel className="bg-transparent! !hover:bg-transparent p-0! h-auto! w-auto! border-0! shadow-none! ring-0! outline-none!">
							<X className="h-4 w-4" />
						</AlertDialogCancel>
					</div>

					<AlertDialogDescription>
						Create and manage your internship goals with sections.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<Tabs
					value={tab}
					onValueChange={(value) => setTab(value as "create" | "manage")}
					className="w-full mt-4"
				>
					<TabsList className="grid w-full grid-cols-2 mb-2">
						<TabsTrigger value="create">Create Goal</TabsTrigger>
						<TabsTrigger value="manage">
							Your Goals ({goals.length})
						</TabsTrigger>
					</TabsList>

					{/* Create Goal Tab */}
					<TabsContent value="create" className="space-y-3">
						{/* Title and Hours */}
						<div className="grid grid-cols-2 gap-3">
							<div>
								<Label htmlFor="create-title" className="text-sm mb-1.5">
									Title
								</Label>
								<Input
									id="create-title"
									type="text"
									placeholder="Enter goal title"
									value={goalValues?.title || ""}
									onChange={(e) =>
										handleFormChange(setGoalValues, "title", e.target.value)
									}
								/>
							</div>
							<div>
								<Label htmlFor="create-goal" className="text-sm mb-1.5">
									Goal (Hours)
								</Label>
								<Input
									id="create-goal"
									type="number"
									placeholder="Enter hours"
									max="1000"
									value={goalValues?.goal || ""}
									onChange={(e) =>
										handleFormChange(
											setGoalValues,
											"goal",
											parseInt(e.target.value) || 0,
										)
									}
								/>
							</div>
						</div>
						{!isStudent && (
							<div className="space-y-2">
								<Label htmlFor="create-section" className="text-sm mb-1.5">
									Sections
								</Label>
								<div className="flex gap-2">
									<Input
										id="create-section"
										type="text"
										placeholder="Add a section (e.g., ITE 222, ITE 223)"
										value={goalValues?.section || ""}
										onChange={(e) =>
											handleFormChange(setGoalValues, "section", e.target.value)
										}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												handleSection("add");
											}
										}}
									/>
									<Button
										type="button"
										size="sm"
										variant="outline"
										onClick={() => handleSection("add")}
										className="shrink-0 bg-transparent h-9"
									>
										<Plus className="h-4 w-4" />
									</Button>
								</div>

								{/* Display added sections */}
								{goalValues?.sections && goalValues.sections.length > 0 && (
									<div className="flex flex-wrap gap-2 mt-3">
										{goalValues?.sections.map((section) => (
											<div
												key={section}
												className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-sm"
											>
												<span>{section}</span>
												<button
													type="button"
													onClick={() => handleSection("remove", section)}
													className="hover:text-destructive transition-colors"
												>
													<X className="h-3 w-3" />
												</button>
											</div>
										))}
									</div>
								)}
							</div>
						)}

						<div className="flex gap-2 pt-2 justify-end">
							{goalValues?.goal_id && (
								<Button
									variant="outline"
									className="w-fit h-9"
									size="sm"
									onClick={handleResetForm}
								>
									Cancel
								</Button>
							)}

							<Button
								onClick={handleCreateGoal}
								size="sm"
								className="w-fit h-9"
								disabled={requiredValues}
							>
								<LoadingButtonText
									isLoading={isLoading}
									loadingTitle={
										goalValues?.goal_id ? "Updating..." : "Creating..."
									}
									title={goalValues?.goal_id ? "Update Goal" : "Create Goal"}
								/>
							</Button>
						</div>
					</TabsContent>

					{/* All Registered Goals Tab */}
					<TabsContent value="manage" className="space-y-3">
						<div className="flex gap-2 items-center w-full">
							<div className="relative flex-1">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
								<Input
									type="text"
									placeholder="Search goals..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="pl-9 h-9 w-full"
								/>
							</div>

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										size="icon"
										variant="outline"
										className="h-9 w-9 bg-transparent shrink-0"
									>
										<Filter className="h-4 w-6" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									{["Active", "Inactive"].map((status) => (
										<DropdownMenuItem
											key={status}
											onClick={() => setFilterStatus(status as Status)}
											className={filterStatus === status ? "bg-muted/30" : ""}
										>
											{status.charAt(0).toUpperCase() + status.slice(1)}
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>

						{goals.length === 0 ? (
							<p className="text-sm text-muted-foreground">
								No goals found. Create a new goal to get started.
							</p>
						) : (
							<RadioGroup
								value={goalState.goal_id}
								onValueChange={(val) => handleSetGoalState(val)}
							>
								{goals.map((goal) => {
									const isActive = goal.status === "Active";
									const isOwner = goal.created_by == user.user_id;
									return (
										<div
											key={goal.goal_id}
											className={`border rounded-lg p-4 space-y-3 transition-colors flex items-start justify-between gap-3 hover:bg-accent/50 `}
										>
											<RadioGroupItem
												value={String(goal.goal_id)}
												className="h-4 w-4 shrink-0 mt-1.5"
											/>
											<div className="flex-1 mb-0">
												<p className="font-medium text-sm">{goal.title}</p>
												<p className="text-xs text-muted-foreground mt-1">
													{goal.metaText}
												</p>
												{!isStudent &&
													goal.sections &&
													goal.sections.length > 0 && (
														<div className="mt-1.5 space-x-2">
															{goal.sections.map((section) => (
																<span
																	key={section}
																	className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
																>
																	{section}
																</span>
															))}
														</div>
													)}
											</div>

											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														size="icon"
														variant="ghost"
														className="h-8 w-8 shrink-0"
													>
														<MoreVertical className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end" className="min-w-48">
													<div className="px-2 py-1.5">
														<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
															Actions
														</p>
													</div>
													<DropdownMenuSeparator />

													{isOwner ? (
														<>
															{!isStudent && (
																<>
																	{["Private Token", "Public Token"].map(
																		(type) => (
																			<DropdownMenuItem
																				key={type}
																				onClick={() => {
																					const token =
																						type === "Private Token"
																							? goal.priToken
																							: goal.pubToken;
																					if (token) {
																						handleCopy(token);
																					}
																				}}
																			>
																				<Copy className="h-4 w-4 mr-2" />
																				{type}
																			</DropdownMenuItem>
																		),
																	)}
																	<DropdownMenuSeparator />
																</>
															)}

															<DropdownMenuItem
																onClick={() => handleEditGoal(goal)}
															>
																<Edit2 className="h-4 w-4 mr-2" />
																Edit
															</DropdownMenuItem>

															<StatusDialog
																user_id={user.user_id}
																goal_id={goal.goal_id}
																targetStatus={isActive ? "Inactive" : "Active"}
																showAlert={showAlert}
																refreshGoals={fetchGoals}
															>
																<DropdownMenuItem
																	onSelect={(e) => e.preventDefault()}
																>
																	{isActive ? (
																		<Trash2 className="h-4 w-4 mr-2" />
																	) : (
																		<CheckCircle2 className="h-4 w-4 mr-2" />
																	)}
																	{isActive ? "Delete" : "Activate"}
																</DropdownMenuItem>
															</StatusDialog>
														</>
													) : (
														<LeaveGoalDialog
															user_id={user.user_id}
															goal_id={goal.goal_id}
															targetStatus={isActive ? "Inactive" : "Active"}
															showAlert={showAlert}
															refreshGoals={fetchGoals}
														>
															<DropdownMenuItem
																onSelect={(e) => e.preventDefault()}
															>
																<X className="h-4 w-4 mr-2" />
																{isActive ? "Leave Goal" : "Rejoin Goal"}
															</DropdownMenuItem>
														</LeaveGoalDialog>
													)}
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
									);
								})}
							</RadioGroup>
						)}
					</TabsContent>
				</Tabs>
			</AlertDialogContent>
		</AlertDialog>
	);
}
