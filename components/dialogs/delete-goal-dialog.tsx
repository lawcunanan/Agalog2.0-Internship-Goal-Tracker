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
import { updateGoalStatus } from "@/services/goals/delete-goal";

interface DeleteGoalDialogProps {
	userId: string;
	goalId: string;
	targetStatus: "Active" | "Inactive";
	showAlert: (status: number, message: string) => void;
	refreshGoals: () => void;
	children: React.ReactNode;
}

export function DeleteGoalDialog({
	userId,
	goalId,
	targetStatus,
	showAlert,
	refreshGoals,
	children,
}: DeleteGoalDialogProps) {
	const [open, setOpen] = useState(false);

	const handleDeleteGoal = async (e: React.MouseEvent) => {
		e.preventDefault();
		if (!userId) {
			showAlert(500, "User details missing");
			return;
		}

		await updateGoalStatus(userId, goalId, targetStatus, showAlert);
		refreshGoals();
		setOpen(false);
	};

	const isDeleting = targetStatus === "Inactive";

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						{isDeleting ? "Delete Goal?" : "Activate Goal?"}
					</AlertDialogTitle>
					<AlertDialogDescription>
						{isDeleting
							? "Are you sure you want to delete this goal? It will be moved to inactive."
							: "Are you sure you want to activate this goal?"}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={(e) => e.stopPropagation()}>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleDeleteGoal}
						className={
							isDeleting
								? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
								: "bg-green-600 text-white hover:bg-green-700"
						}
					>
						{isDeleting ? "Delete" : "Activate"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
