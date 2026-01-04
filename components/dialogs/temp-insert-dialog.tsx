"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { tempInsertLog } from "@/services/logs/temp-insert-log";
import { useAlert } from "@/providers/alert-provider";
import { User, Hash, FileJson, Upload, Loader2 } from "lucide-react";

interface TempInsertDialogProps {
	children: React.ReactNode;
}

export function TempInsertDialog({ children }: TempInsertDialogProps) {
	const { showAlert } = useAlert();
	const [open, setOpen] = useState(false);

	const [targetUserId, setTargetUserId] = useState("");
	const [goalId, setGoalId] = useState("");
	const [rawText, setRawText] = useState("");
	const [loading, setLoading] = useState(false);

	const handleTempInsert = async () => {
		try {
			if (!rawText || !goalId || !targetUserId) {
				showAlert(400, "User ID, Goal ID, and raw data are required");
				return;
			}

			const parsed = JSON.parse(rawText);
			const logs = Array.isArray(parsed) ? parsed : [parsed];

			for (const log of logs) {
				await tempInsertLog(targetUserId, goalId, log, showAlert, setLoading);
			}

			showAlert(200, "Temp insert completed");
			setOpen(false);
			// Reset form
			setTargetUserId("");
			setGoalId("");
			setRawText("");
		} catch (err: any) {
			console.error(err);
			showAlert(500, "Invalid JSON format");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						Data Transfer
					</DialogTitle>
					<DialogDescription>
						Manually insert log data from Firestore JSON export.
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-6 py-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="grid gap-2">
							<Label htmlFor="targetUserId" className="flex items-center gap-2">
								Target User ID
							</Label>
							<Input
								id="targetUserId"
								placeholder="e.g. usr_123..."
								value={targetUserId}
								onChange={(e) => setTargetUserId(e.target.value)}
								className="text-sm"
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="goalId" className="flex items-center gap-2">
								Goal ID
							</Label>
							<Input
								id="goalId"
								placeholder="e.g. goal_456..."
								value={goalId}
								onChange={(e) => setGoalId(e.target.value)}
								className="text-sm"
							/>
						</div>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="rawText" className="flex items-center gap-2">
							<FileJson className="h-4 w-4 text-muted-foreground" />
							Firestore Raw JSON
						</Label>
						<Textarea
							id="rawText"
							placeholder='[{"timeIn": ..., "description": ...}]'
							className="min-h-[250px] max-h-[300px] font-mono text-xs bg-muted/50"
							value={rawText}
							onChange={(e) => setRawText(e.target.value)}
						/>
						<p className="text-xs text-muted-foreground">
							Paste the raw JSON array or object from your Firestore export
							here.
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
					<Button onClick={handleTempInsert} disabled={loading}>
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
