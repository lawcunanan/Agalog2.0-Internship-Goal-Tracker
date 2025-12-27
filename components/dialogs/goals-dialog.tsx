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
import { UserDetails } from "@/providers/auth-provider";

import { insertGoal } from "@/services/goals/insert-goal";
import { updateGoalDetails } from "@/services/goals/update-goal";
import { updateGoalStatus } from "@/services/goals/delete-goal";
import { insertContributor } from "@/services/contributor/insert-contributor";
import { getUserGoals } from "@/services/goals/select-goal";
import { leaveGoalAsContributor } from "@/services/contributor/leave-contributor";

type Goal = {
	created_by: string;
	goal_id: string;
	title: string;
	goal: number;
	metaText: string;
	pubToken?: string | null;
	priToken?: string | null;
	created_at: string;
	status: "Active" | "Inactive";
};

export function GoalsDialog({
	children,
	userId,
	selectedGoal,
	setSelectedGoal,
	userDetails,
	showAlert,
}: {
	children: React.ReactNode;
	userId?: string;
	userDetails?: UserDetails | null;
	selectedGoal: string;
	setSelectedGoal: (goalId: string) => void;
	showAlert: (status: number, message: string) => void;
}) {
	const [mode, setMode] = useState<"join" | "create">("join");
	const [goals, setGoals] = useState<Goal[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [filterStatus, setFilterStatus] = useState<"Active" | "Inactive">(
		"Active",
	);

	// Join
	const [joinToken, setJoinToken] = useState("");
	const [section, setSection] = useState("");
	const [company, setCompany] = useState("");

	// Create / Edit
	const [createTitle, setCreateTitle] = useState("");
	const [createGoal, setCreateGoal] = useState<number>(400);
	const [editingId, setEditingId] = useState<string | null>(null);

	const refreshGoals = () => {
		if (!userId) return;

		getUserGoals(
			userId,
			userDetails?.role || "Student",
			filterStatus || "Active",
			(data) => {
				setGoals(data);
				if (data.length && selectedGoal != data[0].goal_id) {
					setSelectedGoal(String(data[0].goal_id));
				}
			},
			showAlert,
			setIsLoading,
		);
	};

	useEffect(() => {
		refreshGoals();
	}, [userId, filterStatus]);

	const handleJoinGoal = async () => {
		if (!userId || !userDetails?.role) {
			showAlert(500, "User details missing");
			return;
		}

		if (
			!joinToken.trim() ||
			(userDetails?.role === "Student" && (!section.trim() || !company.trim()))
		) {
			showAlert(400, "Please enter all required fields");
			return;
		}

		await insertContributor(
			userId,
			userDetails.role,
			{ token: joinToken, section, company },
			showAlert,
			setIsLoading,
		);

		setJoinToken("");
		setSection("");
		setCompany("");
		refreshGoals();
	};

	const handleGoal = async (action: "create" | "edit") => {
		if (!userId || !userDetails?.role) {
			showAlert(500, "User details missing");
			return;
		}
		if (!createTitle.trim() || createGoal <= 0 || createGoal > 2000) {
			showAlert(400, "Invalid goal details");
			return;
		}

		if (action === "create") {
			await insertGoal(
				userId,
				userDetails.role,
				{ title: createTitle, goal: createGoal },
				showAlert,
				setIsLoading,
			);
		} else if (editingId) {
			await updateGoalDetails(
				editingId,
				{ title: createTitle, goal: createGoal },
				showAlert,
				setIsLoading,
			);
		}

		setEditingId(null);
		setCreateTitle("");
		setCreateGoal(400);
		refreshGoals();
	};

	const handleEditGoal = (goal: Goal) => {
		setEditingId(goal.goal_id);
		setCreateTitle(goal.title);
		setCreateGoal(goal.goal);
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

	const handleLeaveGoal = async (goalId: string) => {
		if (!userId) {
			showAlert(500, "User details missing");
			return;
		}

		await leaveGoalAsContributor(userId, goalId, showAlert);
		refreshGoals();
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
							value={joinToken}
							onChange={(e) => setJoinToken(e.target.value)}
						/>
						{userDetails?.role === "Student" && (
							<>
								<Input
									placeholder="Enter section"
									value={section}
									onChange={(e) => setSection(e.target.value)}
								/>
								<Input
									placeholder="Enter company"
									value={company}
									onChange={(e) => setCompany(e.target.value)}
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
							value={createTitle}
							onChange={(e) => setCreateTitle(e.target.value)}
							maxLength={50}
						/>
						<Input
							type="number"
							value={createGoal}
							onChange={(e) => setCreateGoal(Number(e.target.value))}
							max={2000}
						/>
						<Button onClick={() => handleGoal(editingId ? "edit" : "create")}>
							{editingId ? "Update" : "Create"}
						</Button>
					</div>
				)}

				{/* GOALS */}

				<div className="flex items-center justify-between">
					<Label className="text-sm font-medium">Registered Goals</Label>
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
						<RadioGroup value={selectedGoal} onValueChange={setSelectedGoal}>
							{goals.map((goal) => {
								const isSelected = selectedGoal === String(goal.goal_id);
								const isOwner = userId === goal.created_by;

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
											onClick={() => setSelectedGoal(String(goal.goal_id))}
										>
											<p className="font-medium ">
												{goal.title.charAt(0).toUpperCase() +
													goal.title.slice(1)}
											</p>
											<p className="text-xs text-muted-foreground">
												{goal.metaText}
											</p>

											{["Admin", "Super Admin"].includes(
												userDetails?.role || "",
											) && (
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
																goal.status === "Inactive"
																	? "text-green-500"
																	: "text-destructive"
															}
															onClick={() =>
																handleDeleteGoal(
																	goal.goal_id,
																	goal.status === "Active"
																		? "Inactive"
																		: "Active",
																)
															}
														>
															{goal.status === "Inactive" ? (
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
														className="text-destructive"
														onClick={() => handleLeaveGoal(goal.goal_id)}
													>
														<LogOut className="h-4 w-4" />
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
