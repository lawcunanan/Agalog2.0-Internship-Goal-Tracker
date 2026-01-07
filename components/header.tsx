"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAlert } from "@/providers/alert-provider";
import { useAuth } from "@/providers/auth-provider";
import { signOutUser } from "@/services/auth/logout";
import { useState } from "react";
import { getInitials } from "@/lib/utils";

export function Header() {
	const pathname = usePathname();
	const router = useRouter();
	const { showAlert } = useAlert();
	const { user } = useAuth();
	const [isLoading, setIsLoading] = useState(false);

	const buttonClass = "w-full justify-start cursor-pointer";
	const buttonSize = "sm";

	const handleLogout = async () => {
		await signOutUser(showAlert, router, setIsLoading);
	};

	return (
		<header className="fixed top-0 left-0 right-0 w-full z-50 border-b border-border bg-background/60 backdrop-blur-sm">
			<div className="max-w-300 mx-auto h-20 flex items-center justify-between px-6 ">
				<div className="relative w-10 h-10">
					<div className="absolute inset-0 dark:hidden">
						<Image
							src="/images/logo-light.png"
							alt="Logo"
							fill
							className="object-contain"
							priority
						/>
					</div>

					<div className="absolute inset-0 hidden dark:block">
						<Image
							src="/images/logo-dark.png"
							alt="Logo"
							fill
							className="object-contain"
							priority
						/>
					</div>
				</div>

				<div className="flex items-center gap-4">
					<ThemeToggle />
					{!isLoading && user && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="cursor-pointer border"
								>
									<Menu className="h-6 w-6" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="mt-3 w-56">
								<div className="flex flex-col gap-2 p-2">
									<div className="flex flex-col items-center gap-2 mb-2">
										<Avatar className="h-14 w-14 border-3 border-border">
											<AvatarImage
												src={user.avatar_url}
												alt={user.full_name || "User"}
											/>
											<AvatarFallback>
												{getInitials(user.full_name || user.email)}
											</AvatarFallback>
										</Avatar>
										<div className="flex flex-col items-center">
											<p className="text-sm font-medium">
												{user.full_name || "User"}
											</p>
											<p className="text-xs text-muted-foreground">
												{user.email}
											</p>
											<p className="text-xs font-semibold text-primary mt-1">
												{user.role}
											</p>
										</div>
									</div>
									<DropdownMenuSeparator />

									<Button
										variant="ghost"
										size={buttonSize}
										className={buttonClass}
									>
										Download Report
									</Button>

									<Button
										variant="ghost"
										size={buttonSize}
										className={buttonClass}
									>
										Manage Goals
									</Button>

									<Button
										variant="ghost"
										size={buttonSize}
										className={buttonClass}
									>
										Data Transfer
									</Button>

									<Button
										variant="ghost"
										size={buttonSize}
										className={`${buttonClass} text-destructive hover:text-destructive`}
										onClick={handleLogout}
										disabled={isLoading}
									>
										{isLoading ? "Logging out..." : "Logout"}
									</Button>
								</div>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
			</div>
		</header>
	);
}
