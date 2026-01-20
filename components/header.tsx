"use client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu, Download, ArrowLeftRight } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GoalActiveState, WeeklyLogState } from "@/lib/types";
import { LoadingButtonText } from "@/components/ui/loading-button-text";
import { useAlert } from "@/providers/alert-provider";
import { useAuth } from "@/providers/auth-provider";
import { LogoutDialog } from "@/components/dialogs/auth/logout-dialog";
import { JoinGoalDialog } from "./dialogs/goals/join-dialog";
import { ManageGoalsDialog } from "./dialogs/goals/manage-dialog";
import { getInitials } from "@/lib/utils";
import { exportLog } from "@/lib/utils/export-log";
import { TempInsertDialog } from "@/components/dialogs/goals/temp-insert-dialog";

interface HeaderProps {
	goalState?: GoalActiveState;
	setGoalState?: (goalState: GoalActiveState) => void;
	logState?: WeeklyLogState;
	goalHours?: number;
	refreshLogs?: (goalId?: string) => void;
}
export function Header({
	goalState,
	setGoalState,
	logState,
	goalHours,
	refreshLogs,
}: HeaderProps) {
	const { showAlert } = useAlert();
	const { user } = useAuth();

	const [isExporting, setIsExporting] = useState(false);
	const buttonClass = "w-full justify-start cursor-pointer gap-2";
	const buttonSize = "sm";
	const isStudent = user?.role === "Student";
	const isAdmin = user?.role === "Admin";

	const handleExport = () => {
		if (!user) return;
		exportLog(
			user.fullname || user.email || "Student",
			logState || { logs: [], currentHours: 0 },
			goalHours || 0,
			showAlert,
			setIsExporting,
		);
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
					{user && (
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
												loading="lazy"
												referrerPolicy="no-referrer"
											/>
											<AvatarFallback>
												{getInitials(user.fullname || user.email)}
											</AvatarFallback>
										</Avatar>
										<div className="flex flex-col items-center">
											<p className="text-sm font-medium">
												{user.fullname || "User"}
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
									{(isStudent || isAdmin) && (
										<>
											<JoinGoalDialog user={user} showAlert={showAlert} />
											<ManageGoalsDialog
												user={user}
												goalState={goalState || ({} as any)}
												setGoalState={setGoalState || (() => {})}
												showAlert={showAlert}
												refreshLogs={refreshLogs || (() => {})}
											/>
											{logState?.logs.length! > 0 && (
												<Button
													variant="ghost"
													size={buttonSize}
													className={buttonClass}
													onClick={handleExport}
												>
													<Download className="h-4 w-4" />
													<LoadingButtonText
														isLoading={isExporting}
														loadingTitle="Exporting..."
														title="Export Logs"
													/>
												</Button>
											)}
											{isAdmin && (
												<TempInsertDialog>
													<Button
														variant="ghost"
														size={buttonSize}
														className={buttonClass}
													>
														<ArrowLeftRight className="h-4 w-4" />
														Data Transfer
													</Button>
												</TempInsertDialog>
											)}
										</>
									)}

									<LogoutDialog showAlert={showAlert} />
								</div>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
			</div>
		</header>
	);
}
