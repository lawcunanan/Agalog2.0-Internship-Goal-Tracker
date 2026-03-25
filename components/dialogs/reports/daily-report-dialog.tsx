import type React from "react";
import { useRef, useState } from "react";
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
import { X, Printer, FileText, Paperclip, Trash2 } from "lucide-react";
import Image from "next/image";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { WeeklyLogSelect } from "@/lib/types";


interface DailyReportDialogProps {
	name: string;
	company: string;
	data: WeeklyLogSelect[];
	signatureUrl?: string;
}

export function DailyReportDialog({
	name,
	company,
	data,
	signatureUrl,
}: DailyReportDialogProps) {
	const [selectedWeek, setSelectedWeek] = useState<string>(
		data.length > 0 ? data[0].weekLabel : "1",
	);

	const weeks = data.map((w) => w.weekLabel);

	const selectedWeekData = data.find((w) => w.weekLabel === selectedWeek);

	const [attachedImage, setAttachedImage] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const url = URL.createObjectURL(file);
			setAttachedImage(url);
		}
		e.target.value = "";
	};

	const handleRemoveAttachment = () => {
		if (attachedImage) {
			URL.revokeObjectURL(attachedImage);
			setAttachedImage(null);
		}
	};

	const handlePrint = () => {
		window.print();
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className="w-full justify-start cursor-pointer gap-2"
				>
					<FileText className="h-4 w-4" />
					Daily Report
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto no-padding">
				<AlertDialogHeader className="no-print">
					<div className="flex items-center justify-between">
						<AlertDialogTitle>Daily Attendance Report</AlertDialogTitle>
						<AlertDialogCancel className="bg-transparent! !hover:bg-transparent p-0! h-auto! w-auto! border-0! shadow-none! ring-0! outline-none!">
							<X className="h-5 w-5" />
						</AlertDialogCancel>
					</div>

					<AlertDialogDescription>
						Preview of the daily attendance report.
					</AlertDialogDescription>
				</AlertDialogHeader>

				{/* Controls Section - Dropdown and Buttons */}
				<div className="no-print mb-1 flex items-center justify-between gap-2">
					<Select value={selectedWeek} onValueChange={setSelectedWeek}>
						<SelectTrigger className="w-full sm:w-48">
							<SelectValue placeholder="Select Week" />
						</SelectTrigger>
						<SelectContent>
							{weeks.map((week) => (
								<SelectItem key={week} value={week.toString()}>
									Week {week}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<div className="flex items-center gap-2">
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							onChange={handleAttach}
							className="hidden"
						/>
						<Button
							variant="outline"
							size="sm"
							onClick={() => fileInputRef.current?.click()}
							className="flex items-center gap-2 h-9"
						>
							<Paperclip className="h-4 w-4" />
							Attach
						</Button>
						<Button
							variant="default"
							size="sm"
							onClick={handlePrint}
							className="flex items-center gap-2 w-24 h-9"
						>
							<Printer className="h-4 w-4" />
							Print
						</Button>
					</div>
				</div>

				{/* Report Container - A4 Size */}
				<div className="overflow-x-auto bg-white">
					<div className="border border-border p-8 w-[221mm] print:w-[210mm] mx-auto no-padding">
						<div className="space-y-4 pb-0">
							{/* Logo and Title */}
							<div className="flex items-center justify-center gap-6 mb-8">
								<div className="relative w-20 h-20 shrink-0">
									<Image
										src="/images/nu-logo.png"
										alt="NU Baliwag Logo"
										fill
										className="object-contain"
									/>
								</div>
								<div>
									<h1
										className="text-4xl font-bold"
										style={{ color: "#35408e" }}
									>
										NU BALIWAG
									</h1>
									<p className="text-lg" style={{ color: "#35408e" }}>
										School of Engineering and Technology
									</p>
								</div>
							</div>
							<div className="h-1.5 border-yellow-500 border-b-4 w-full mb-6"></div>
							<h2 className="text-center text-xl font-bold text-slate-900 mt-1.5">
								DAILY ATTENDANCE REPORT
							</h2>
						</div>
						{/* Employee Details Table */}
						<div className="border border-gray-400 mt-6 ">
							{/* Name Row */}
							<div
								className="grid gap-0 border-b border-gray-400"
								style={{ gridTemplateColumns: "110px 1fr" }}
							>
								<div className="border-r border-gray-400 p-3">
									<p className="text-sm italic font-semibold text-slate-900">
										Name:
									</p>
								</div>
								<div className="p-3">
									<p className="text-sm text-slate-900">{name}</p>
								</div>
							</div>
							{/* Company Row */}
							<div
								className="grid gap-0 border-b border-gray-400"
								style={{ gridTemplateColumns: "110px 1fr" }}
							>
								<div className="border-r border-gray-400 p-3">
									<p className="text-sm italic font-semibold text-slate-900">
										Company:
									</p>
								</div>
								<div className="p-3 b">
									<p className="text-sm text-slate-900">{company}</p>
								</div>
							</div>
							{/* Week No. Row */}
							<div
								className="grid gap-0 border-b border-gray-400"
								style={{ gridTemplateColumns: "110px 1fr" }}
							>
								<div className="border-r border-gray-400 p-3">
									<p className="text-sm italic font-semibold text-slate-900">
										Week No.:
									</p>
								</div>
								<div className="p-3">
									<p className="text-sm text-slate-900">
										{parseInt(selectedWeek)}
									</p>
								</div>
							</div>
							{/* NOTE Row */}
							<div className="flex gap-0">
								<div className="p-3">
									<p className="text-xs font-semibold text-slate-900">NOTE:</p>
								</div>
								<div className="flex-1 p-3">
									<p className="text-xs text-slate-900 leading-relaxed">
										To be filled-up by the intern and signed by the Internship
										Supervisor/Immediate supervisor. This must be submitted to
										the Internship Coordinator along with the weekly activity
										report.
									</p>
								</div>
							</div>
						</div>
						{/* Attendance Table */}
						<div className="border-x border-gray-400 border-b-0">
							<table className="w-full">
								<thead>
									<tr className="border-b border-gray-400">
										<th className="border-r border-gray-400 p-2 text-center font-semibold text-slate-900 text-sm w-1/4">
											Date
										</th>
										<th className="border-r border-gray-400 p-2 text-center font-semibold text-slate-900 text-sm w-1/4">
											Time-In
										</th>
										<th className="border-r border-gray-400 p-2 text-center font-semibold text-slate-900 text-sm w-1/4">
											Time-Out
										</th>
										<th className="p-2 text-center font-semibold text-slate-900 text-sm">
											Total Hours
										</th>
									</tr>
								</thead>
								<tbody>
									{(selectedWeekData?.logs || []).map((log, index) => (
										<tr key={index} className="border-b border-gray-400">
											<td className="border-r border-gray-400 p-2 text-center text-sm text-slate-900 font-medium">
												{log.date}
											</td>
											<td className="border-r border-gray-400 p-2 text-center text-sm text-slate-900">
												{log.timeIn}
											</td>
											<td className="border-r border-gray-400 p-2 text-center text-sm text-slate-900">
												{log.timeOut}
											</td>
											<td className="p-2 text-center text-sm text-slate-900">
												{log.hoursWorked}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						{/* Summary Row */}
						<div className="border-x border-b border-gray-400">
							<div className="grid grid-cols-3">
								<div className="border-r border-gray-400 p-4 text-center">
									<p className="text-xs font-bold text-slate-900">
										Previous Total:
									</p>
									<p className="text-base font-bold text-slate-900 mt-2">
										{selectedWeekData?.previousHours || "0hr 0min"}
									</p>
								</div>
								<div className="border-r border-gray-400 p-4 text-center">
									<p className="text-xs font-bold text-slate-900">
										Total this Period:
									</p>
									<p className="text-base font-bold text-slate-900 mt-2">
										{selectedWeekData?.thisPeriodHours || "0hr 0min"}
									</p>
								</div>
								<div className="p-4 text-center">
									<p className="text-xs font-bold text-slate-900 leading-tight">
										Total Hours Served:
									</p>
									<p className="text-xs text-slate-600 text-center leading-snug">
										(Previous Total + Total this Period)
									</p>
									<p className="text-base font-bold text-slate-900 mt-2">
										{selectedWeekData?.totalHours || "0hr 0min"}
									</p>
								</div>
							</div>
						</div>
						{/* Signature Sections */}
						<div className="border-x border-b border-gray-400">
							<div className="grid grid-cols-2">
								{/* Intern Section */}
								<div className="border-r border-gray-400 p-4">
									<p className="text-base font-bold text-slate-900 mb-2">
										Intern Signature
									</p>
									<div className="mb-1 relative h-16 w-full overflow-hidden">
										{signatureUrl && (
											<Image
												src={signatureUrl || "/images/signature.png"}
												alt="Intern Signature"
												fill
												className="object-contain"
											/>
										)}
									</div>
									<div className="border-t border-gray-400 pt-3">
										<p className="text-xs text-slate-900 font-semibold">
											Date:{" "}
											<span className="text-slate-600">
												{selectedWeekData?.endDate}
											</span>
										</p>
									</div>
								</div>
								{/* Supervisor Section */}
								<div className="p-4">
									<p className="text-base font-bold text-slate-900 mb-2">
										Supervisor Signature
									</p>
									<div className="mb-1 relative h-16 w-full overflow-hidden"></div>
									<div className="border-t border-gray-400 pt-3">
										<p className="text-xs text-slate-900 font-semibold">
											Date:{" "}
											<span className="text-slate-600">
												{selectedWeekData?.endDate}
											</span>
										</p>
									</div>
								</div>
							</div>
						</div>
						{/* Verification Statement */}
						<div className="border-x border-b border-gray-400 p-4">
							<p className="text-sm text-slate-900 italic leading-snug">
								I verify that the above information is correct and that the
								intern was in attendance on the above days at the times
								indicated.
							</p>
						</div>

						{/* Attached Image */}
						{attachedImage && (
							<div className="border-x border-b border-gray-400 p-4">
								<div className="flex items-center justify-between mb-2">
									<p className="text-xs font-bold text-slate-900">
										Attachment:
									</p>
									<button
										type="button"
										onClick={handleRemoveAttachment}
										className="no-print text-slate-400 hover:text-red-500 transition-colors"
									>
										<Trash2 className="h-4 w-4" />
									</button>
								</div>
								<div className="flex justify-center">
									<img
										src={attachedImage}
										alt="Attached"
										className="max-w-full max-h-100 object-contain rounded"
									/>
								</div>
							</div>
						)}

						{/* Footer - Inside the report container */}
						<p className="mt-4 text-xs text-slate-700 font-semibold">
							CCIT-FO-017
						</p>
					</div>
				</div>
			</AlertDialogContent>
		</AlertDialog>
	);
}
