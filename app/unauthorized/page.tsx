"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOutUser } from "@/services/csr/auth/logout";
import { useAlert } from "@/providers/alert-provider";
import { useAuth } from "@/providers/auth-provider";
import { LoadingButtonText } from "@/components/ui/loading-button-text";

export default function UnauthorizedPage() {
	const { user } = useAuth();
	const { showAlert } = useAlert();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const handleLogout = async (e: React.MouseEvent) => {
		e.preventDefault();
		if (user && user?.role) {
			router.push(`/`);
		} else {
			await signOutUser(showAlert, setIsLoading);
		}
	};

	return (
		<div className="flex h-screen w-full flex-col items-center justify-center gap-4 text-center p-4">
			<div className="flex h-52 w-52 items-center justify-center rounded-full bg-destructive/5">
				<ShieldAlert className="h-24 w-24 text-destructive" />
			</div>
			<div className="space-y-2">
				<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
					Unauthorized Access
				</h1>
				<p className="max-w-150 text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
					You do not have permission to view this page. If you believe this is a
					mistake, please contact the administrator.
				</p>
			</div>
			<div className="flex gap-2">
				<Button variant="default" onClick={handleLogout} disabled={isLoading}>
					<LoadingButtonText
						isLoading={isLoading}
						loadingTitle="Logging out..."
						title="Go Home"
					/>
				</Button>
			</div>
		</div>
	);
}
