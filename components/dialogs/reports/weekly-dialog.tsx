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
import { X, Download, CalendarDays } from "lucide-react";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { WeeklyLogSelect } from "@/lib/types";
import { getCurrentDateLong } from "@/lib/utils/dateTimeUtils";

interface WeeklyReportDialogProps {
	name: string;
	company: string;
	data: WeeklyLogSelect[];
	signatureUrl?: string;
}

export function WeeklyReportDialog({
	name,
	company,
	data,
	signatureUrl,
}: WeeklyReportDialogProps) {
	const [selectedWeek, setSelectedWeek] = useState<string>(
		data.length > 0 ? data[0].weekLabel : "1",
	);

	const weeks = data.map((w) => w.weekLabel);

	const selectedWeekData = data.find((w) => w.weekLabel === selectedWeek);

	const [overallDescription, setOverallDescription] = useState<string>("");

	const handleDescriptionChange = (
		e: React.ChangeEvent<HTMLTextAreaElement>,
	) => {
		setOverallDescription(e.target.value);
	};

	const handleDownloadPDF = () => {
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
					<CalendarDays className="h-4 w-4 " />
					Weekly Report
				</Button>
			</AlertDialogTrigger>
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
						className="flex items-center gap-2 w-24 h-9"
					>
						<Download className="h-4 w-4" />
						PDF
					</Button>
				</div>

				{/* Report Container - A4 Size */}
				<div className="overflow-x-auto bg-white">
					<div className="border border-border p-8  w-[222mm] print:w-[210mm] mx-auto no-padding">
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
								style={{ gridTemplateColumns: "130px 1fr" }}
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
								style={{ gridTemplateColumns: "130px 1fr" }}
							>
								<div className="border-r border-gray-400 p-3">
									<p className="text-sm italic font-semibold text-slate-900">
										Company:
									</p>
								</div>
								<div className="p-3">
									<p className="text-sm text-slate-900">{company}</p>
								</div>
							</div>
							{/* Week No. Row */}
							<div
								className="grid gap-0 border-b border-gray-400"
								style={{ gridTemplateColumns: "130px 1fr" }}
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
							{/* Dates Covered Row */}
							<div
								className="grid gap-0 border-b border-gray-400"
								style={{ gridTemplateColumns: "130px 1fr" }}
							>
								<div className="border-r border-gray-400 p-3">
									<p className="text-sm italic font-semibold text-slate-900">
										Dates Covered:
									</p>
								</div>
								<div className="p-3">
									<p className="text-sm text-slate-900">
										{selectedWeekData?.startDate} - {selectedWeekData?.endDate}
									</p>
								</div>
							</div>
							{/* Description Section */}
							<div className="p-3">
								<p className="text-sm font-semibold text-slate-900 mb-2">
									Describe your internship experience this week:
								</p>
								<p className="text-sm text-slate-900 leading-relaxed hidden print:block">
									{overallDescription}
								</p>
								<Textarea
									value={overallDescription}
									onChange={handleDescriptionChange}
									className="text-sm text-slate-900 leading-relaxed no-print bg-white! border-gray-400"
									rows={5}
								/>
							</div>
						</div>

						{/* Daily Activity Entries */}
						<div className="border border-t-0 border-gray-400 mt-0">
							{(selectedWeekData?.logs || []).map((log, index) => (
								<div
									key={index}
									className={`p-4 ${
										index !== (selectedWeekData?.logs || []).length - 1
											? "border-b border-gray-400"
											: ""
									}`}
								>
									<div className="space-y-2">
										<p className="text-xs font-bold text-slate-900">
											Date: {log.date}
										</p>
										<p className="text-xs font-bold text-slate-900">
											Day: {log.day}
										</p>
										{log.description && (
											<p className="text-xs text-slate-900 leading-relaxed">
												{log.description}
											</p>
										)}
									</div>
								</div>
							))}
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
										<Image
											src={signatureUrl || "/images/signature.png"}
											alt="Intern Signature"
											fill
											className="object-contain"
										/>
									</div>
									<div className="border-t border-gray-400 pt-3">
										<p className="text-xs text-slate-900 font-semibold">
											Date:{" "}
											<span className="text-slate-600">
												{getCurrentDateLong()}
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
											Date:
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
