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
import { updateGoalStatus } from "@/services/csr/goals/update-status";

type StatusDialogProps = {
	user_id: string;
	goal_id: string;
	targetStatus: Status;
	showAlert: (status: number, message: string) => void;
	refreshGoals: () => void;
	children: React.ReactNode;
};

export function StatusDialog({
	user_id,
	goal_id,
	targetStatus,
	showAlert,
	refreshGoals,
	children,
}: StatusDialogProps) {
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleDeleteGoal = async (e: React.MouseEvent) => {
		e.preventDefault();
		if (!user_id) {
			showAlert(500, "User details missing");
			return;
		}

		await updateGoalStatus(
			user_id,
			goal_id,
			targetStatus,
			showAlert,
			setIsLoading,
		);
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
						disabled={isLoading}
						onClick={handleDeleteGoal}
						className={
							isDeleting
								? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
								: "bg-green-600 text-white hover:bg-green-700"
						}
					>
						<LoadingButtonText
							isLoading={isLoading}
							loadingTitle={isDeleting ? "Deleting..." : "Activating..."}
							title={isDeleting ? "Delete Goal" : "Activate Goal"}
						/>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
