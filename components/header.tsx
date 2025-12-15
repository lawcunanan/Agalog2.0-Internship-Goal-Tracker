"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
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

export function Header() {
	const pathname = usePathname();
	const buttonClass = "w-full justify-start cursor-pointer";
	const buttonSize = "sm";

	const user = {
		displayName: "John Doe",
		email: "johndoe@example.com",
		photoURL: "",
	};

	return (
		<header className="fixed top-0 left-0 right-0 w-full z-50 border-b border-border bg-background/60 backdrop-blur-sm  ">
			<div className="max-w-[1200px] mx-auto h-20 flex items-center justify-between px-6 ">
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
							<DropdownMenuContent align="end" className="w-56">
								<div className="flex flex-col gap-2 p-2">
									<div className="flex flex-col items-center gap-2 mb-2">
										<Avatar className="h-12 w-12">
											<AvatarImage
												src={user?.photoURL || undefined}
												alt={user?.displayName || "User"}
											/>
											<AvatarFallback>
												{user?.displayName?.charAt(0) || "U"}
											</AvatarFallback>
										</Avatar>
										<div className="flex flex-col items-center">
											<p className="text-sm font-medium">
												{user?.displayName || "User"}
											</p>
											<p className="text-xs text-muted-foreground">
												{user?.email || "user@example.com"}
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

											<Button
												variant="ghost"
												size={buttonSize}
												className={buttonClass}
											>
												Edit Goal
											</Button>
										</>
									)}

									<Button
										variant="ghost"
										size={buttonSize}
										className={`${buttonClass} text-destructive hover:text-destructive`}
									>
										Logout
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
