"use client";

import { usePathname } from "next/navigation";
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
import { useAuth } from "@/providers/auth-provider";
import { LogoutDialog } from "@/components/dialogs/logout-dialog";
import { GoalsDialog } from "@/components/dialogs/goals-dialog";
import { useAlert } from "@/providers/alert-provider";

interface HeaderProps {
	selectedGoal?: string;
	setSelectedGoal?: (goalId: string) => void;
}

export function Header({ selectedGoal, setSelectedGoal }: HeaderProps) {
	const pathname = usePathname();
	const { user, userDetails } = useAuth();
	const { showAlert } = useAlert();

	const buttonClass = "w-full justify-start cursor-pointer";
	const buttonSize = "sm";

	return (
		<header className="fixed top-0 left-0 right-0 w-full z-50 border-b border-border bg-background/60 backdrop-blur-sm  ">
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
					{["/logs", "/dashboard"].includes(pathname) && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon" className="cursor-pointer">
									<Menu className="h-6 w-6" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="mt-3 w-56">
								<div className="flex flex-col gap-2 p-2">
									<div className="flex flex-col items-center gap-2 mb-2">
										<Avatar className="h-14 w-14">
											<AvatarImage
												src={userDetails?.avatar_url || undefined}
												alt={userDetails?.full_name || "User"}
											/>
											<AvatarFallback>
												{userDetails?.full_name?.charAt(0) || "U"}
											</AvatarFallback>
										</Avatar>
										<div className="flex flex-col items-center">
											<p className="text-sm font-medium">
												{userDetails?.full_name || "User"}
											</p>
											<p className="text-xs text-muted-foreground">
												{userDetails?.email || "user@example.com"}
											</p>
										</div>
									</div>
									<DropdownMenuSeparator />
									{pathname === "/logs" && (
										<>
											<Button
												variant="ghost"
												size={buttonSize}
												className={buttonClass}
											>
												Download Report
											</Button>
										</>
									)}

									<GoalsDialog
										userId={user?.id || ""}
										userDetails={userDetails || ({} as any)}
										selectedGoal={selectedGoal || ""}
										setSelectedGoal={setSelectedGoal || (() => {})}
										showAlert={showAlert}
									>
										<Button
											variant="ghost"
											size={buttonSize}
											className={buttonClass}
										>
											Manage Goals
										</Button>
									</GoalsDialog>
									<LogoutDialog>
										<Button
											variant="ghost"
											size={buttonSize}
											className={`${buttonClass} text-destructive hover:text-destructive`}
										>
											Logout
										</Button>
									</LogoutDialog>
								</div>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
			</div>
		</header>
	);
}
