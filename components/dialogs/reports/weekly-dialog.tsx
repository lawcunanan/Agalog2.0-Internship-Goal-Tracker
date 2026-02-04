"use client";

import type React from "react";
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
import { X, Download } from "lucide-react";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface ActivityEntry {
	date: string;
	day: string;
	activity: string;
}

interface WeeklyActivityReportData {
	weekNumber: number;
	name: string;
	company: string;
	datesCovered: string;
	overallDescription: string;
	activities: ActivityEntry[];
}

const MOCK_ACTIVITY_REPORT_DATA: WeeklyActivityReportData = {
	weekNumber: 8,
	name: "Lawrence S. Cunanan",
	company: "Argon Software Development Services",
	datesCovered: "Jan 12, 2026 - Jan 16, 2026",
	overallDescription:
		"During Week 8 at Argon Software Development Services, I reviewed and analyzed UI/UX page, collaborated on creating UI/UX layouts and Figma designs for multiple modules, and worked on the Admin Dashboard. I also implemented and tested the Chat Sign-in feature and finished several additional layouts, contributing to both system improvements and overall user experience enhancements.",
	activities: [
		{
			date: "Date: Jan 12, 2026",
			day: "Day: Monday",
			activity:
				"Reviewed and did initial check of the Chat with Mayor project and upskilled by learning more about Next.js framework.",
		},
		{
			date: "Date: Jan 13, 2026",
			day: "Day: Tuesday",
			activity:
				"Attended the demo of the 'Chat with Mayor' project and finished the landing page for the HEXP project.",
		},
		{
			date: "Date: Jan 14, 2026",
			day: "Day: Wednesday",
			activity:
				"Today, I worked with Pierre to create layouts for our co-interns to use as UI/UX guides for the HEXP Landing Page, the Registration Module, and the System Admin Dashboard Tello tickets. I also prepared the Figma layouts and planned the implementation of the Guest Account feature for the Chat with Mayor project.",
		},
		{
			date: "Date: Jan 15, 2026",
			day: "Day: Thursday",
			activity:
				"Started creating layouts for the Admin Dashboard UI, worked on the Admin Partner Laboratory, Patient, and User page layouts, and implemented Ticket 39 (Guest Sign-in) for the Chat with Mayor project, including testing and updating database policies to allow guest sign-ins.",
		},
		{
			date: "Date: Jan 16, 2026",
			day: "Day: Friday",
			activity:
				"Completed the UI/UX layouts for HEXP 3 to HEXP 9 and created a new design for the root page of the Chat with Mayor project.",
		},
	],
};

export function WeeklyReportDialog({
	children,
}: {
	children: React.ReactNode;
}) {
	const [reportData, setReportData] = useState<WeeklyActivityReportData>(
		MOCK_ACTIVITY_REPORT_DATA,
	);
	const [selectedWeek, setSelectedWeek] = useState<string>("8");

	const weeks = Array.from({ length: 16 }, (_, i) => i + 1);

	const handleDescriptionChange = (
		e: React.ChangeEvent<HTMLTextAreaElement>,
	) => {
		setReportData({ ...reportData, overallDescription: e.target.value });
	};

	const handleDownloadPDF = () => {
		window.print();
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent className="sm:max-w-4xl max-h-[95vh] overflow-y-auto no-padding">
				<AlertDialogHeader className="no-print">
					<div className="flex items-center justify-between">
						<AlertDialogTitle>Weekly Activity Report</AlertDialogTitle>
						<AlertDialogCancel className="bg-transparent! !hover:bg-transparent p-0! h-auto! w-auto! border-0! shadow-none! ring-0! outline-none!">
							<X className="h-5 w-5" />
						</AlertDialogCancel>
					</div>

					<AlertDialogDescription>
						Preview of the weekly activity report.
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
						{/* Header Section */}
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
								WEEKLY ACTIVITY REPORT
							</h2>
						</div>

						{/* Employee Details Table */}
						<div className="border border-gray-400 mt-6">
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
								<div className="p-3">
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
							{/* Dates Covered Row */}
							<div
								className="grid gap-0 border-b border-gray-400"
								style={{ gridTemplateColumns: "110px 1fr" }}
							>
								<div className="border-r border-gray-400 p-3">
									<p className="text-sm italic font-semibold text-slate-900">
										Dates Covered:
									</p>
								</div>
								<div className="p-3">
									<p className="text-sm text-slate-900">
										{reportData.datesCovered}
									</p>
								</div>
							</div>
							{/* Description Section */}
							<div className="p-3">
								<p className="text-sm font-semibold text-slate-900 mb-2">
									Describe your internship experience this week:
								</p>
								<p className="text-sm text-slate-900 leading-relaxed hidden print:block">
									{reportData.overallDescription}
								</p>
								<Textarea
									value={reportData.overallDescription}
									onChange={handleDescriptionChange}
									className="text-sm text-slate-900 leading-relaxed no-print"
									rows={5}
								/>
							</div>
						</div>

						{/* Daily Activity Entries */}
						<div className="border border-t-0 border-gray-400 mt-0">
							{reportData.activities.map((activity, index) => (
								<div
									key={index}
									className={`p-4 ${
										index !== reportData.activities.length - 1
											? "border-b border-gray-400"
											: ""
									}`}
								>
									<div className="space-y-2">
										<p className="text-xs font-bold text-slate-900">
											{activity.date}
										</p>
										<p className="text-xs font-bold text-slate-900">
											{activity.day}
										</p>
										<p className="text-xs text-slate-900 leading-relaxed">
											{activity.activity}
										</p>
									</div>
								</div>
							))}
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
						{/* Footer - Inside the report container */}
						<p className="mt-4 text-xs text-slate-700 font-semibold">
							CCIT-FO-016
						</p>
					</div>
				</div>
			</AlertDialogContent>
		</AlertDialog>
	);
}
