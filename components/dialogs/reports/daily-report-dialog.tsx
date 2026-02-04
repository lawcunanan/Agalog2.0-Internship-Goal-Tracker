import type React from "react";
import { useEffect, useState } from "react";
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
import { X, Download } from "lucide-react";
import Image from "next/image";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface DayLog {
	date: string;
	timeIn: string;
	timeOut: string;
	workHours: string;
	breakTime: string;
}

interface WeeklyReportData {
	weekNumber: number;
	name: string;
	company: string;
	previousTotal: string;
	totalThisPeriod: string;
	totalServed: string;
	days: DayLog[];
}

const MOCK_REPORT_DATA: WeeklyReportData = {
	weekNumber: 8,
	name: "Lawrence S. Cunanan",
	company: "Argon Software Development Services",
	previousTotal: "230hr 7min",
	totalThisPeriod: "41hr 38min",
	totalServed: "277hr 45min",
	days: [
		{
			date: "Jan 12, 2026",
			timeIn: "08:24 am",
			timeOut: "05:29 pm",
			workHours: "8 hours 7m",
			breakTime: "58 minutes",
		},
		{
			date: "Jan 12, 2026",
			timeIn: "08:24 am",
			timeOut: "05:29 pm",
			workHours: "8 hours 7m",
			breakTime: "58 minutes",
		},
		{
			date: "Jan 12, 2026",
			timeIn: "08:24 am",
			timeOut: "05:29 pm",
			workHours: "8 hours 7m",
			breakTime: "58 minutes",
		},
		{
			date: "Jan 12, 2026",
			timeIn: "08:24 am",
			timeOut: "05:29 pm",
			workHours: "8 hours 7m",
			breakTime: "58 minutes",
		},
	],
};

export function DailyReportDialog({ children }: { children: React.ReactNode }) {
	const [reportData] = useState<WeeklyReportData>(MOCK_REPORT_DATA);
	const [selectedWeek, setSelectedWeek] = useState<string>("8");

	const weeks = Array.from({ length: 16 }, (_, i) => i + 1);

	const handleDownloadPDF = () => {
		window.print();
	};

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.ctrlKey && event.key === "p") {
				event.preventDefault();
				window.print();
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent className="sm:max-w-4xl max-h-[95vh] overflow-y-auto no-padding">
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
				<div className="no-print mb-2 flex items-center justify-between gap-4">
					<Select value={selectedWeek} onValueChange={setSelectedWeek}>
						<SelectTrigger className="w-48">
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

					<Button
						variant="default"
						size="sm"
						onClick={handleDownloadPDF}
						className="flex items-center gap-2 text-white w-24 h-9"
					>
						<Download className="h-4 w-4" />
						PDF
					</Button>
				</div>

				{/* Report Container - A4 Size */}
				<div className="overflow-x-auto">
					<div className="border border-border p-8 print:w-[210mm] mx-auto no-padding">
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
									<p className="text-sm text-slate-900">{reportData.name}</p>
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
									<p className="text-sm text-slate-900">{reportData.company}</p>
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
										{reportData.weekNumber}
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
									{reportData.days.map((day, index) => (
										<tr key={index} className="border-b border-gray-400">
											<td className="border-r border-gray-400 p-2 text-center text-sm text-slate-900 font-medium">
												{day.date}
											</td>
											<td className="border-r border-gray-400 p-2 text-center text-sm text-slate-900">
												{day.timeIn}
											</td>
											<td className="border-r border-gray-400 p-2 text-center text-sm text-slate-900">
												{day.timeOut}
											</td>
											<td className="p-2 text-center text-sm text-slate-900">
												{day.workHours}
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
										{reportData.previousTotal}
									</p>
								</div>
								<div className="border-r border-gray-400 p-4 text-center">
									<p className="text-xs font-bold text-slate-900">
										Total this Period:
									</p>
									<p className="text-base font-bold text-slate-900 mt-2">
										{reportData.totalThisPeriod}
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
										{reportData.totalServed}
									</p>
								</div>
							</div>
						</div>
						{/* Signature Sections */}
						<div className="border-x border-b border-gray-400">
							<div className="grid grid-cols-2">
								{/* Intern Section */}
								<div className="border-r border-gray-400 p-4">
									<p className="text-base font-bold text-slate-900 mb-6">
										Intern Signature
									</p>
									<div className="mb-4 h-9 flex items-center">
										<Image
											src="/images/sample-signature.png"
											alt="Intern Signature"
											width={120}
											height={40}
											className="object-contain"
										/>
									</div>
									<div className="border-t border-gray-400 pt-3">
										<p className="text-xs text-slate-900 font-semibold">
											Date:{" "}
											<span className="text-slate-600">January 16, 2026</span>
										</p>
									</div>
								</div>
								{/* Supervisor Section */}
								<div className="p-4">
									<p className="text-base font-bold text-slate-900 mb-6">
										Supervisor Signature
									</p>
									<div className="mb-4 h-9 flex items-center">
										<Image
											src="/images/sample-signature.png"
											alt="Supervisor Signature"
											width={120}
											height={40}
											className="object-contain"
										/>
									</div>
									<div className="border-t border-gray-400 pt-3">
										<p className="text-xs text-slate-900 font-semibold">
											Date:{" "}
											<span className="text-slate-600">January 16, 2026</span>
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
