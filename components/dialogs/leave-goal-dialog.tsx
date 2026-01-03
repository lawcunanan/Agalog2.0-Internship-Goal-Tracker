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
import { leaveGoalAsContributor } from "@/services/contributor/leave-contributor";

interface LeaveGoalDialogProps {
	userId: string;
	goalId: string;
	targetStatus: "Active" | "Inactive";
	showAlert: (status: number, message: string) => void;
	refreshGoals: () => void;
	children: React.ReactNode;
}

export function LeaveGoalDialog({
	userId,
	goalId,
	targetStatus,
	showAlert,
	refreshGoals,
	children,
}: LeaveGoalDialogProps) {
	const [open, setOpen] = useState(false);

	const handleLeaveGoal = async (e: React.MouseEvent) => {
		e.preventDefault();
		if (!userId) {
			showAlert(500, "User details missing");
			return;
		}

		await leaveGoalAsContributor(userId, goalId, targetStatus, showAlert);
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
						{isLeaving ? "Leave" : "Rejoin"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
