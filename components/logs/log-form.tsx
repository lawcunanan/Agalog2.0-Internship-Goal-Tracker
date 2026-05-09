"use client";

import { useEffect, useState } from "react";
import { FadeIn } from "@/components/ui/fade-in";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { LogValues } from "@/lib/types";
import {
	getPHWeekday,
	toISODate,
	convert12To24,
} from "@/lib/utils/dateTimeUtils";
import { upsertLog } from "@/services/csr/logs/upsert-log";

type LogFormProps = {
	goal_id: string;
	editLog?: LogValues | null;
	onEdit: (log: LogValues | null) => void;
	user: any;
	showAlert: (status: number, message: string) => void;
	refreshLogs: (goal_id: string) => void;
	isCompleted?: boolean;
};

export function LogForm({
	goal_id,
	editLog,
	onEdit,
	user,
	showAlert,
	refreshLogs,
	isCompleted = false,
}: LogFormProps) {
	const defaults = (): LogValues => ({
		log_id: "",
		date: getPHWeekday(),
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
	const [logData, setLogData] = useState<LogValues>(defaults());

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
		refreshLogs(goal_id);
		onEdit(null);
	};

	const selectedDate = logData.date
		? new Date(logData.date + "T00:00:00")
		: undefined;

	const isDateDisabled = (date: Date) => {
		const day = date.getDay();
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		return day === 0 || day === 6 || date > today;
	};

	return (
		<FadeIn className="space-y-8">
			<h2 className="text-4xl font-bold tracking-tight">Log & Go!</h2>

			<form onSubmit={handleSubmit} className="space-y-6 ">
				<div className="space-y-2">
					<Label htmlFor="date">
						Date <span className="text-red-500">*</span>
					</Label>
					<Popover>
						<PopoverTrigger asChild>
							<Button
								type="button"
								variant="outline"
								disabled={!goal_id}
								className={cn(
									"shadow-none w-full justify-start text-left font-normal",
									!selectedDate && "text-muted-foreground",
								)}
							>
								<CalendarIcon className="h-4 w-4" />
								{selectedDate
									? selectedDate.toLocaleDateString("en-US", {
											year: "numeric",
											month: "long",
											day: "numeric",
										})
									: "Pick a date"}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0" align="start">
							<Calendar
								mode="single"
								selected={selectedDate}
								onSelect={(date) => {
									if (!date) return;
									setLogData((prev) => ({
										...prev,
										date: toISODate(date),
									}));
								}}
								disabled={isDateDisabled}
								autoFocus
							/>
						</PopoverContent>
					</Popover>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2 min-w-0">
						<Label htmlFor="timeIn">
							Time In <span className="text-red-500">*</span>
						</Label>
						<Input
							type="time"
							id="timeIn"
							className="shadow-none w-full"
							value={logData.timeIn}
							onChange={handleChange}
							disabled={!goal_id}
							required
						/>
					</div>
					<div className="space-y-2 min-w-0">
						<Label htmlFor="timeOut">
							Time Out{" "}
							{!!logData.timeIn && <span className="text-red-500">*</span>}
						</Label>
						<Input
							type="time"
							id="timeOut"
							className="shadow-none w-full"
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
							className="shadow-none w-full"
							value={logData.breakOut}
							onChange={handleChange}
							disabled={!logData.timeOut}
						/>
					</div>
					<div className="space-y-2 min-w-0">
						<Label htmlFor="breakBack">
							Break Back{" "}
							{!!logData.breakOut && <span className="text-red-500">*</span>}
						</Label>
						<Input
							type="time"
							id="breakBack"
							className="shadow-none w-full"
							value={logData.breakBack}
							onChange={handleChange}
							disabled={!logData.breakOut}
							required={!!logData.breakOut}
						/>
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="description">Description</Label>
					<RichTextEditor
						value={logData.description}
						onChange={(html) =>
							setLogData((prev) => ({ ...prev, description: html }))
						}
						placeholder="Briefly describe your tasks for the day..."
						rows={4}
						ai={{ mode: "improve" }}
						onAIError={(message) => showAlert(400, message)}
					/>
				</div>

				<Button
					type="submit"
					className="w-full bg-blue-700 hover:bg-blue-800 text-white shadow-none cursor-pointer"
					size="lg"
					disabled={loading || !goal_id || (isCompleted && !editLog)}
				>
					{loading
						? editLog
							? "Updating Log"
							: "Adding Log"
						: editLog
							? "Update Log"
							: "Log Today"}
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
		</FadeIn>
	);
}
