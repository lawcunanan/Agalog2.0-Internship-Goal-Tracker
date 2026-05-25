"use client";

import { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { tempInsertLogs } from "@/services/csr/goals/temp-insert-log";
import {
	getGoalContributors,
	type GoalContributor,
} from "@/services/csr/contributors/select-contributors";
import { getGoals } from "@/services/csr/goals/select-goals";
import { useAlert } from "@/providers/alert-provider";
import { useAuth } from "@/providers/auth-provider";
import { GoalsState } from "@/lib/types";
import { FileJson, Loader2, ArrowLeftRight } from "lucide-react";

const SAMPLE_JSON = `[
  {
    "date": "2026-05-20",
    "timeIn": "08:00",
    "timeOut": "17:00",
    "breakOut": "12:00",
    "breakBack": "13:00",
    "description": "I worked on UI tasks."
  }
]`;

export function TempInsertDialog() {
	const { showAlert } = useAlert();
	const { user } = useAuth();

	const [open, setOpen] = useState(false);
	const [goals, setGoals] = useState<GoalsState[]>([]);
	const [contributors, setContributors] = useState<GoalContributor[]>([]);
	const [goalId, setGoalId] = useState("");
	const [targetUserId, setTargetUserId] = useState("");
	const [rawText, setRawText] = useState("");
	const [loading, setLoading] = useState(false);
	const [loadingContributors, setLoadingContributors] = useState(false);

	useEffect(() => {
		if (!open || !user?.user_id || !user?.role) return;
		getGoals(user.user_id, user.role, "", "Active", setGoals, showAlert);
	}, [open, user?.user_id, user?.role, showAlert]);

	useEffect(() => {
		if (!goalId) {
			setContributors([]);
			setTargetUserId("");
			return;
		}
		setLoadingContributors(true);
		setTargetUserId("");
		getGoalContributors(goalId)
			.then(setContributors)
			.finally(() => setLoadingContributors(false));
	}, [goalId]);

	const reset = () => {
		setGoalId("");
		setTargetUserId("");
		setRawText("");
		setContributors([]);
	};

	const handleInsert = async () => {
		if (!goalId || !targetUserId) {
			showAlert(400, "Please pick a goal and a user.");
			return;
		}
		if (!rawText.trim()) {
			showAlert(400, "Please paste your JSON log data.");
			return;
		}

		let parsed: unknown;
		try {
			parsed = JSON.parse(rawText);
		} catch {
			showAlert(400, "Invalid JSON format.");
			return;
		}
		const logs = Array.isArray(parsed) ? parsed : [parsed];

		setLoading(true);
		try {
			const { inserted, skipped, errors } = await tempInsertLogs(
				targetUserId,
				goalId,
				logs,
			);
			if (errors.length > 0) console.warn("[tempInsertLogs] skipped:", errors);
			showAlert(
				200,
				`Inserted ${inserted} log(s)${skipped ? `, skipped ${skipped}` : ""}.`,
			);
			setOpen(false);
			reset();
		} catch (err) {
			showAlert(500, err instanceof Error ? err.message : "Insert failed.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(next) => {
				setOpen(next);
				if (!next) reset();
			}}
		>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className="w-full justify-start cursor-pointer gap-2"
				>
					<ArrowLeftRight className="h-4 w-4" />
					Data Transfer
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-150">
				<DialogHeader>
					<DialogTitle>Data Transfer</DialogTitle>
					<DialogDescription>
						Bulk-insert logs for a contributor of a goal.
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-6 py-4">
					<div className="grid gap-2">
						<Label htmlFor="goal">Goal</Label>
						<Select value={goalId} onValueChange={setGoalId}>
							<SelectTrigger id="goal" className="w-full">
								<SelectValue placeholder="Select a goal" />
							</SelectTrigger>
							<SelectContent>
								{goals.length === 0 ? (
									<div className="px-2 py-1.5 text-sm text-muted-foreground">
										No goals available
									</div>
								) : (
									goals.map((g) => (
										<SelectItem key={g.goal_id} value={g.goal_id}>
											{g.title}
											{g.company ? ` — ${g.company}` : ""}
										</SelectItem>
									))
								)}
							</SelectContent>
						</Select>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="user">Target User</Label>
						<Select
							value={targetUserId}
							onValueChange={setTargetUserId}
							disabled={!goalId || loadingContributors}
						>
							<SelectTrigger id="user" className="w-full">
								<SelectValue
									placeholder={
										!goalId
											? "Pick a goal first"
											: loadingContributors
												? "Loading users..."
												: "Select a user"
									}
								/>
							</SelectTrigger>
							<SelectContent>
								{contributors.length === 0 ? (
									<div className="px-2 py-1.5 text-sm text-muted-foreground">
										No users for this goal
									</div>
								) : (
									contributors.map((c) => (
										<SelectItem key={c.user_id} value={c.user_id}>
											{c.fullname || c.email}
											{c.role ? ` (${c.role})` : ""}
										</SelectItem>
									))
								)}
							</SelectContent>
						</Select>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="rawText" className="flex items-center gap-2">
							<FileJson className="h-4 w-4 text-muted-foreground" />
							Log JSON
						</Label>
						<Textarea
							id="rawText"
							placeholder={SAMPLE_JSON}
							className="min-h-62.5 max-h-75 font-mono text-xs bg-muted/50"
							value={rawText}
							onChange={(e) => setRawText(e.target.value)}
						/>
						<p className="text-xs text-muted-foreground">
							Required: <code>date</code> (YYYY-MM-DD), <code>timeIn</code>,{" "}
							<code>timeOut</code> (HH:mm). Optional: <code>breakOut</code>,{" "}
							<code>breakBack</code>, <code>description</code>.
						</p>
					</div>
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => setOpen(false)}
						disabled={loading}
					>
						Cancel
					</Button>
					<Button onClick={handleInsert} disabled={loading}>
						{loading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Inserting...
							</>
						) : (
							"Insert Logs"
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
