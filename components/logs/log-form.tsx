"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Log } from "@/lib/types";
import { toISODate, convert12To24 } from "@/lib/utils/dateTimeUtils";
import { upsertLog } from "@/services/logs/upsert-log";
import { set } from "date-fns";

export function LogForm({
	goal_id,
	editLog,
	onEdit,
	user,
	showAlert,
	refreshLogs,
}: {
	goal_id: string;
	editLog?: Log | null;
	onEdit: (log: Log | null) => void;
	user: any;
	showAlert: (status: number, message: string) => void;
	refreshLogs: () => void;
}) {
	const defaults = (): Log => ({
		log_id: "",
		date: toISODate(new Date()),
		timeIn: "",
		timeOut: "",
		breakOut: "",
		breakBack: "",
		breakDuration: "",
		hoursWorked: "",
		rawHours: 0,
		description: "",
	});

	const [loading, setLoading] = useState(false);
	const [logData, setLogData] = useState<Log>(defaults());

	// Load edit log into state if provided
	useEffect(() => {
		if (editLog) {
			setLogData({
				...editLog,
				date: toISODate(editLog.fullDate),
				timeIn: convert12To24(editLog.timeIn),
				timeOut: convert12To24(editLog.timeOut),
				breakOut: convert12To24(editLog.breakOut),
				breakBack: convert12To24(editLog.breakBack),
			});
		} else {
			setLogData(defaults());
		}
	}, [editLog]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { id, value } = e.target;

		// Validation logic
		if (
			id === "timeOut" &&
			value &&
			logData.timeIn &&
			value <= logData.timeIn
		) {
			showAlert(400, "Time Out must be after Time In");
			return;
		}
		if (
			id === "breakBack" &&
			value &&
			logData.breakOut &&
			value <= logData.breakOut
		) {
			showAlert(400, "Break Back must be after Break Out");
			return;
		}
		if (id === "breakOut" && value) {
			if (logData.timeIn && value <= logData.timeIn) {
				showAlert(400, "Break Out must be after Time In");
				return;
			}
			if (logData.timeOut && value >= logData.timeOut) {
				showAlert(400, "Break Out must be before Time Out");
				return;
			}
		}
		if (id === "breakBack" && value) {
			if (logData.timeIn && value <= logData.timeIn) {
				showAlert(400, "Break Back must be after Time In");
				return;
			}
			if (logData.timeOut && value >= logData.timeOut) {
				showAlert(400, "Break Back must be before Time Out");
				return;
			}
		}

		setLogData((prev) => ({ ...prev, [id]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!user) {
			showAlert(500, "You must be logged in to submit attendance.");
			return;
		}

		await upsertLog(user.user_id, goal_id, logData, showAlert, setLoading);

		handleReset();
	};

	const handleReset = (e?: React.MouseEvent) => {
		e?.preventDefault?.();
		setLogData(defaults());
		refreshLogs();
		onEdit(null);
	};

	return (
		<div className="space-y-8">
			<h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
				Log & Go!
			</h2>

			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="space-y-2">
					<Label htmlFor="date">
						Date <span className="text-red-500">*</span>
					</Label>
					<Input
						type="date"
						id="date"
						className="shadow-none"
						value={logData.date}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="timeIn">
							Time In <span className="text-red-500">*</span>
						</Label>
						<Input
							type="time"
							id="timeIn"
							className="shadow-none"
							value={logData.timeIn}
							onChange={handleChange}
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="timeOut">
							Time Out{" "}
							{!!logData.timeIn && <span className="text-red-500">*</span>}
						</Label>
						<Input
							type="time"
							id="timeOut"
							className="shadow-none"
							value={logData.timeOut}
							onChange={handleChange}
							disabled={!logData.timeIn}
							required={!!logData.timeIn}
						/>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2 min-w-0">
						<Label htmlFor="breakOut">Break Out</Label>
						<Input
							type="time"
							id="breakOut"
							className="shadow-none"
							value={logData.breakOut}
							onChange={handleChange}
							disabled={!logData.timeOut}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="breakBack">
							Break Back{" "}
							{!!logData.breakOut && <span className="text-red-500">*</span>}
						</Label>
						<Input
							type="time"
							id="breakBack"
							className="shadow-none"
							value={logData.breakBack}
							onChange={handleChange}
							disabled={!logData.breakOut}
							required={!!logData.breakOut}
						/>
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="description">Description</Label>
					<Textarea
						id="description"
						placeholder="Describe your tasks for the day..."
						className="min-h-25 resize-none shadow-none"
						value={logData.description}
						onChange={handleChange}
					/>
				</div>

				<Button
					type="submit"
					className="w-full bg-blue-700 hover:bg-blue-800 text-white shadow-none cursor-pointer"
					size="lg"
					disabled={loading || !goal_id}
				>
					{loading
						? editLog
							? "Updating Log"
							: "Adding Log"
						: editLog
						? "Update Log"
						: "Add Log"}
				</Button>

				{editLog && (
					<button
						type="button"
						onClick={handleReset}
						className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
					>
						Reset Form
					</button>
				)}
			</form>
		</div>
	);
}
