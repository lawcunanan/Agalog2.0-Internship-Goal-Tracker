"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
	AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus, Settings } from "lucide-react";

const MOCK_GOALS = [
	{
		id: 1,
		title: "Summer Internship 2024",
		hours: 400,
		sections: ["Web Development", "UI/UX Design"],
		dateAdded: new Date("2024-01-15"),
		isActive: true,
		privateToken: "priv_abc123def456",
		publicToken: "pub_xyz789uvw012",
		company: "Tech Corp",
	},
];

type Goal = {
	id: number;
	title: string;
	hours: number;
	sections: string[];
	dateAdded: Date;
	isActive: boolean;
	privateToken: string;
	publicToken: string;
	company: string;
};

export function ManageGoalsDialog() {
	const [goals, setGoals] = useState<Goal[]>(MOCK_GOALS);

	// Create mode state
	const [createTitle, setCreateTitle] = useState("");
	const [createGoal, setCreateGoal] = useState("");
	const [createSection, setCreateSection] = useState("");
	const [createSections, setCreateSections] = useState<string[]>([]);
	const [createCompany, setCreateCompany] = useState("");

	const [editingId, setEditingId] = useState<number | null>(null);

	const handleCreateGoal = () => {
		resetForm();
		alert("Goal created successfully!");
	};

	const handleAddSection = () => {
		if (!createSection.trim()) return;
		if (createSections.includes(createSection.trim())) {
			alert("This section is already added");
			return;
		}
		setCreateSections([...createSections, createSection.trim()]);
		setCreateSection("");
	};

	const handleRemoveSection = (section: string) => {
		setCreateSections(createSections.filter((s) => s !== section));
	};

	const resetForm = () => {
		setEditingId(null);
		setCreateTitle("");
		setCreateGoal("");
		setCreateSection("");
		setCreateSections([]);
		setCreateCompany("");
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className="w-full justify-start cursor-pointer gap-2"
				>
					<Settings className="h-4 w-4" />
					Manage Goal
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
				<AlertDialogHeader>
					<div className="flex items-center justify-between">
						<AlertDialogTitle>Manage Internship Goals</AlertDialogTitle>
						<AlertDialogCancel className="bg-transparent! !hover:bg-transparent p-0! h-auto! w-auto! border-0! shadow-none! ring-0! outline-none!">
							<X className="h-4 w-4" />
						</AlertDialogCancel>
					</div>

					<AlertDialogDescription>
						Create and manage your internship goals with sections.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<Tabs defaultValue="create" className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="create">Create Goal</TabsTrigger>
						<TabsTrigger value="all">
							All Registered Goals ({goals.length})
						</TabsTrigger>
					</TabsList>

					{/* Create Goal Tab */}
					<TabsContent value="create" className="space-y-4 mt-2">
						{/* Title and Hours */}
						<div className="grid grid-cols-2 gap-3">
							<div>
								<Label htmlFor="create-title" className="text-sm">
									Title
								</Label>
								<Input
									id="create-title"
									type="text"
									placeholder="Enter goal title"
									value={createTitle}
									onChange={(e) => setCreateTitle(e.target.value)}
									className="mt-1.5"
								/>
							</div>
							<div>
								<Label htmlFor="create-goal" className="text-sm">
									Goal (Hours)
								</Label>
								<Input
									id="create-goal"
									type="number"
									placeholder="Enter hours"
									value={createGoal}
									onChange={(e) => setCreateGoal(e.target.value)}
									max="2000"
									className="mt-1.5"
								/>
							</div>
						</div>

						<div>
							<Label htmlFor="create-company" className="text-sm">
								Company
							</Label>
							<Input
								id="create-company"
								type="text"
								placeholder="Enter company name"
								value={createCompany}
								onChange={(e) => setCreateCompany(e.target.value)}
								className="mt-1.5"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="create-section" className="text-sm">
								Sections
							</Label>
							<div className="flex gap-2">
								<Input
									id="create-section"
									type="text"
									placeholder="Add a section (e.g., Backend, Frontend)"
									value={createSection}
									onChange={(e) => setCreateSection(e.target.value)}
									onKeyPress={(e) => {
										if (e.key === "Enter") {
											handleAddSection();
										}
									}}
								/>
								<Button
									type="button"
									size="sm"
									variant="outline"
									onClick={handleAddSection}
									className="shrink-0 bg-transparent"
								>
									<Plus className="h-4 w-4" />
								</Button>
							</div>

							{/* Display added sections */}
							{createSections.length > 0 && (
								<div className="flex flex-wrap gap-2 mt-3">
									{createSections.map((section) => (
										<div
											key={section}
											className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-sm"
										>
											<span>{section}</span>
											<button
												onClick={() => handleRemoveSection(section)}
												className="hover:text-destructive transition-colors"
											>
												<X className="h-3 w-3" />
											</button>
										</div>
									))}
								</div>
							)}
						</div>

						<div className="flex gap-2 pt-2 justify-end">
							{editingId && (
								<Button
									variant="outline"
									size="sm"
									onClick={resetForm}
									className="w-fit bg-transparent"
								>
									Cancel
								</Button>
							)}
							<Button onClick={handleCreateGoal} size="sm" className="w-fit">
								{editingId ? "Update Goal" : "Create Goal"}
							</Button>
						</div>
					</TabsContent>

					{/* All Registered Goals Tab */}
					<TabsContent value="all" className="space-y-3 mt-3.5">
						<div className="flex gap-2 items-center w-full">ey </div>
					</TabsContent>
				</Tabs>
			</AlertDialogContent>
		</AlertDialog>
	);
}
