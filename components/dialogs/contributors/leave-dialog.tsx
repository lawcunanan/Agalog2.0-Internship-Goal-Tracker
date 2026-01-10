"use client";

import { useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LoadingButtonText } from "@/components/ui/loading-button-text";
import { Status } from "@/lib/types";
import { leaveGoalAsContributor } from "@/services/csr/contributors/leave-contributor";

interface LeaveGoalDialogProps {
	user_id: string;
	goal_id: string;
	targetStatus: Status;
	showAlert: (status: number, message: string) => void;
	refreshGoals: () => void;
	children: React.ReactNode;
}

export function LeaveGoalDialog({
	user_id,
	goal_id,
	targetStatus,
	showAlert,
	refreshGoals,
	children,
}: LeaveGoalDialogProps) {
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleLeaveGoal = async (e: React.MouseEvent) => {
		e.preventDefault();
		if (!user_id) {
			showAlert(500, "User details missing");
			return;
		}

		await leaveGoalAsContributor(
			user_id,
			goal_id,
			targetStatus,
			showAlert,
			setIsLoading,
		);
		refreshGoals();
		setOpen(false);
	};

	const isLeaving = targetStatus === "Inactive";

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						{isLeaving ? "Leave Goal?" : "Rejoin Goal?"}
					</AlertDialogTitle>
					<AlertDialogDescription>
						{isLeaving
							? "Are you sure you want to leave this goal? You can rejoin later if you have the token."
							: "Are you sure you want to rejoin this goal?"}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={(e) => e.stopPropagation()}>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleLeaveGoal}
						className={
							isLeaving
								? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
								: "bg-green-600 text-white hover:bg-green-700"
						}
					>
						<LoadingButtonText
							isLoading={isLoading}
							loadingTitle={isLeaving ? "Leaving..." : "Rejoining..."}
							title={isLeaving ? "Leave Goal" : "Rejoin Goal"}
						/>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
