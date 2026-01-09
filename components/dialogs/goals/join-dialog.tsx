"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogCancel,
	AlertDialogTrigger,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { X, Shield, Target } from "lucide-react";

const GOALS_DATABASE: Record<
	string,
	{ title: string; hours: number; company: string; sections: string[] }
> = {
	"1234": {
		title: "Summer Internship 2024",
		hours: 400,
		company: "Tech Corp",
		sections: ["Web Development", "UI/UX Design", "Backend Development"],
	},
};

export function JoinGoalDialog() {
	const [open, setOpen] = useState(false);
	const [token, setToken] = useState("");
	const [foundGoal, setFoundGoal] = useState<{
		title: string;
		hours: number;
		company: string;
		sections: string[];
	} | null>(null);
	const [selectedSection, setSelectedSection] = useState("");
	const [company, setCompany] = useState("");

	const handleCheckToken = async () => {
		if (!token.trim()) return;

		const goalData = GOALS_DATABASE[token];
		if (goalData) {
			setFoundGoal(goalData);
			setCompany(goalData.company);
		} else {
			alert("Token not found. Please check and try again.");
			setFoundGoal(null);
		}
	};

	const handleJoinGoal = () => {
		if (!selectedSection) {
			alert("Please select a section");
			return;
		}
		alert(
			`Successfully joined goal: ${foundGoal?.title} with section: ${selectedSection}`,
		);
		resetForm();
		setOpen(false);
	};

	const resetForm = () => {
		setToken("");
		setFoundGoal(null);
		setSelectedSection("");
		setCompany("");
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className="w-full justify-start cursor-pointer gap-2"
				>
					<Target className="h-4 w-4" />
					Join Goal
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className="sm:max-w-sm">
				<AlertDialogCancel className="absolute right-5 top-5 bg-transparent! !hover:bg-transparent p-0! h-auto! w-auto! border-0! shadow-none! ring-0! outline-none!">
					<X className="h-4 w-4" />
				</AlertDialogCancel>

				<div className="text-center space-y-5 py-4 pb-0">
					{/* Icon */}
					<div className="flex justify-center">
						<div className="rounded-full bg-primary/10 p-4">
							<Shield className="h-8 w-8 text-primary" />
						</div>
					</div>

					{/* Title */}
					<AlertDialogHeader>
						<AlertDialogTitle className="text-center">
							Join a Goal
						</AlertDialogTitle>
						<AlertDialogDescription className="text-center">
							Enter the token provided by your mentor
						</AlertDialogDescription>
					</AlertDialogHeader>

					{!foundGoal ? (
						<div className="space-y-3">
							<div className="space-y-2">
								<Label htmlFor="token" className="text-sm">
									Goal Token
								</Label>

								<Input
									id="token"
									type="text"
									placeholder="Enter token (e.g., 1234)"
									value={token}
									onChange={(e) => setToken(e.target.value)}
									onKeyPress={(e) => {
										if (e.key === "Enter") {
											handleCheckToken();
										}
									}}
									className="flex-1"
								/>
							</div>
						</div>
					) : (
						<div className="space-y-4">
							<div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-1">
								<p className="text-primary tracking-normal text-base font-semibold">
									{foundGoal.title}
								</p>
								<p className="text-sm text-muted-foreground">
									{foundGoal.hours} hours goal
								</p>
							</div>

							{/* Company Field - Input */}
							<div className="space-y-2">
								<Label htmlFor="company" className="text-sm">
									Company
								</Label>
								<Input
									id="company"
									type="text"
									placeholder="Enter company name"
									value={company}
									onChange={(e) => setCompany(e.target.value)}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="section" className="text-sm">
									School Section
								</Label>
								<Select
									value={selectedSection}
									onValueChange={setSelectedSection}
								>
									<SelectTrigger id="section" className="w-full">
										<SelectValue placeholder="Select a section" />
									</SelectTrigger>
									<SelectContent>
										{foundGoal.sections.map((section) => (
											<SelectItem key={section} value={section}>
												{section}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="flex gap-2 pt-4 justify-end">
								<Button variant="outline" className="w-fit" size="sm">
									Back
								</Button>
								<Button onClick={handleJoinGoal} className="w-fit" size="sm">
									Join Goal
								</Button>
							</div>
						</div>
					)}
				</div>
			</AlertDialogContent>
		</AlertDialog>
	);
}
