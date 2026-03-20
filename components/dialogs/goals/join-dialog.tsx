"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogCancel,
	AlertDialogTrigger,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { X, Target, Key } from "lucide-react";
import { LoadingButtonText } from "@/components/ui/loading-button-text";
import { UserSelect, GoalsState, GoalActiveState } from "@/lib/types";
import { handleFormChange } from "@/lib/utils";
import { checkToken } from "@/services/csr/contributors/check-token";
import { upsertContributor } from "@/services/csr/contributors/upsert-contributor";

type JoinGoalDialogProps = {
	user: UserSelect;
	setGoalState: (goalState: GoalActiveState) => void;
	refreshLogs: (goalId?: string) => void;
	showAlert: (status: number, message: string) => void;
};

export function JoinGoalDialog({
	user,
	setGoalState,
	refreshLogs,
	showAlert,
}: JoinGoalDialogProps) {
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [token, setToken] = useState("");
	const [goalValues, setGoalValues] = useState<GoalsState>({
		goal_id: "",
		title: "",
		goal: 0,
		sections: [],
		company: "",
		section: "",
	});

	const isStudent = user?.role === "Student";
	const requiredValues =
		(isStudent && (!goalValues?.company || !goalValues?.section)) ||
		!goalValues?.goal_id;

	const handleCheckToken = async () => {
		if (isLoading) return;
		if (!user) return showAlert(500, "User not found.");
		if (!token.trim()) return showAlert(300, "Please enter a valid token.");

		await checkToken(
			user.user_id,
			token.trim(),
			user.role || "Student",
			setGoalValues,
			showAlert,
			setIsLoading,
		);

		setToken("");
	};

	const handleJoinGoal = async () => {
		if (isLoading) return;
		if (!user) return showAlert(500, "User not found.");
		if (requiredValues)
			return showAlert(300, "Please fill in all required fields.");

		await upsertContributor(
			user.user_id,
			goalValues.goal_id,
			user.role || "Student",
			{ ...goalValues },
			showAlert,
			setIsLoading,
		);

		setGoalState({
			goal_id: goalValues.goal_id,
			goalHours: goalValues.goal,
			company: goalValues.company,
		});

		refreshLogs(goalValues.goal_id);

		handleReset();
		setOpen(false);
	};

	const handleReset = () => {
		setToken("");
		setGoalValues({
			goal_id: "",
			title: "",
			goal: 0,
			company: "",
			section: "",
			sections: [],
		});
	};
	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className="w-full justify-start cursor-pointer gap-2"
				>
					<Target className="h-4 w-4" />
					Join a Goal
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className="sm:max-w-sm">
				<AlertDialogCancel className="absolute right-5 top-5 bg-transparent! !hover:bg-transparent p-0! h-auto! w-auto! border-0! shadow-none! ring-0! outline-none!">
					<X className="h-5 w-5" />
				</AlertDialogCancel>

				<div className="text-center space-y-5 py-4 pb-0">
					{/* Icon */}
					<div className="flex justify-center">
						<div
							className="rounded-full bg-green-900 p-4 
							border border-white 
							ring-1 ring-gray-300/10
							shadow-lg shadow-green-900/30"
						>
							<Key className="h-8 w-8 text-green-100" />
						</div>
					</div>
					{/* Title */}
					<AlertDialogHeader>
						<AlertDialogTitle className="text-center">
							Join a Goal
						</AlertDialogTitle>
						<AlertDialogDescription className="text-center">
							Enter your goal token to join!
						</AlertDialogDescription>
					</AlertDialogHeader>

					{!goalValues?.goal_id ? (
						<div className="space-y-3">
							<div className="space-y-2">
								<Label htmlFor="token">Goal Token</Label>
								<Input
									id="token"
									type="text"
									placeholder="Enter goal token"
									value={token}
									onChange={(e) => setToken(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter") handleCheckToken();
									}}
									className="flex-1"
									disabled={isLoading}
								/>
								<div className="text-sm text-left mt-2 space-y-1">
									<p className="text-foreground">Available tokens:</p>
									<p className="text-muted-foreground">
										Intern 2: GpMEMFxFDxfHy0DaHUsXHFRh
									</p>
								</div>
							</div>
						</div>
					) : (
						<div className="space-y-4">
							<div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-1">
								<p className="text-primary tracking-normal text-base font-semibold">
									{goalValues?.title || "Goal Title"}
								</p>
								<p className="text-sm text-muted-foreground">
									{goalValues?.goal || 0} hours goal
								</p>
							</div>

							{/* Company Field - Input */}
							{isStudent && (
								<>
									<div>
										<Label htmlFor="company" className="text-sm mb-1.5">
											Company
										</Label>
										<Input
											id="company"
											type="text"
											placeholder="Enter company name"
											value={goalValues?.company || ""}
											onChange={(e) =>
												handleFormChange(
													setGoalValues,
													"company",
													e.target.value,
												)
											}
										/>
									</div>

									<div>
										<Label htmlFor="section" className="text-sm mb-1.5">
											School Section
										</Label>
										<Select
											value={goalValues?.section || ""}
											onValueChange={(value) =>
												handleFormChange(setGoalValues, "section", value)
											}
										>
											<SelectTrigger id="section" className="w-full">
												<SelectValue placeholder="Select a section" />
											</SelectTrigger>
											<SelectContent>
												{goalValues?.sections?.map((section) => (
													<SelectItem key={section} value={section}>
														{section}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</>
							)}

							<div className="flex gap-2 pt-4 justify-end">
								<Button
									variant="outline"
									className="w-fit h-9"
									size="sm"
									onClick={handleReset}
								>
									Back
								</Button>
								<Button
									className="w-fit h-9"
									size="sm"
									disabled={requiredValues || isLoading}
									onClick={handleJoinGoal}
								>
									<LoadingButtonText
										isLoading={isLoading}
										loadingTitle="Joining..."
										title="Join a Goal"
									/>
								</Button>
							</div>
						</div>
					)}
				</div>
			</AlertDialogContent>
		</AlertDialog>
	);
}
