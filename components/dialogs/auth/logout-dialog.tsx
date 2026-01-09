"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
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
import { signOutUser } from "@/services/ssr/auth/logout";

export function LogoutDialog({
	showAlert,
}: {
	showAlert: (status: number, message: string) => void;
}) {
	const [isLoading, setIsLoading] = useState(false);
	const [open, setOpen] = useState(false);

	const handleLogout = async (e: React.MouseEvent) => {
		e.preventDefault();
		await signOutUser(showAlert, setIsLoading);
		setOpen(false);
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className="w-full justify-start cursor-pointer gap-2 text-destructive hover:text-red-600"
				>
					<LogOut className="h-4 w-4" /> Logout
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
					<AlertDialogDescription>
						You will be redirected to the login page.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel className="bo" disabled={isLoading}>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleLogout}
						disabled={isLoading}
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
					>
						<LoadingButtonText
							isLoading={isLoading}
							loadingTitle="Logging out..."
							title="Logout"
						/>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
