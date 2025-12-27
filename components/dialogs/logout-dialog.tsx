"use client";

import * as React from "react";

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
import { useAlert } from "@/providers/alert-provider";
import { signOutUser } from "@/services/auth/logout";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function LogoutDialog({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const { showAlert } = useAlert();
	const [isLoading, setIsLoading] = React.useState(false);

	const handleLogout = async (e: React.MouseEvent) => {
		e.preventDefault();
		await signOutUser(showAlert, router, setIsLoading);
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
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
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Logging out...
							</>
						) : (
							"Logout"
						)}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
