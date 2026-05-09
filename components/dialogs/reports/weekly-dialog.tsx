"use client";

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
import {
	X,
	Printer,
	CalendarDays,
	Paperclip,
	Trash2,
	Sparkles,
} from "lucide-react";
import Image from "next/image";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { WeeklyLogSelect } from "@/lib/types";
import { cn, getReportFileName } from "@/lib/utils";
import { sanitizeHTML, stripHTMLToText } from "@/lib/utils/html";
import { useAlert } from "@/providers/alert-provider";


const readAttachments = (key: string): string[] => {
	if (typeof window === "undefined") return [];
	const saved = localStorage.getItem(key);
	if (!saved) return [];
	try {
		const parsed = JSON.parse(saved);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
};

const readDescription = (key: string): string => {
	if (typeof window === "undefined") return "";
	return localStorage.getItem(key) ?? "";
};

interface WeeklyReportDialogProps {
	name: string;
	company: string;
	data: WeeklyLogSelect[];
	signatureUrl?: string;
	supSignatureUrl?: string;
}

export function WeeklyReportDialog({
	name,
	company,
	data,
	signatureUrl,
	supSignatureUrl,
}: WeeklyReportDialogProps) {
	const { showAlert } = useAlert();
	const [selectedWeek, setSelectedWeek] = useState<string>(
		data.length > 0 ? data[0].weekLabel : "1",
	);

	const weeks = data.map((w) => w.weekLabel);

	const selectedWeekData = data.find((w) => w.weekLabel === selectedWeek);

	const fileInputRef = useRef<HTMLInputElement>(null);

	const descriptionKey = `war-description-week-${selectedWeek}`;
	const [overallDescription, setOverallDescription] = useState<string>(() =>
		readDescription(descriptionKey),
	);
	const [prevDescKey, setPrevDescKey] = useState(descriptionKey);
	if (prevDescKey !== descriptionKey) {
		setPrevDescKey(descriptionKey);
		setOverallDescription(readDescription(descriptionKey));
	}

	const handleDescriptionChange = (value: string) => {
		setOverallDescription(value);
		try {
			if (value) {
				localStorage.setItem(descriptionKey, value);
			} else {
				localStorage.removeItem(descriptionKey);
			}
		} catch {
			showAlert(400, "Storage limit reached. Could not save description.");
		}
	};

	const storageKey = `war-attachments-week-${selectedWeek}`;
	const [, setAttachmentsVersion] = useState(0);
	const attachedImages = readAttachments(storageKey);

	const writeAttachments = (next: string[]) => {
		try {
			if (next.length > 0) {
				localStorage.setItem(storageKey, JSON.stringify(next));
			} else {
				localStorage.removeItem(storageKey);
			}
			setAttachmentsVersion((v) => v + 1);
		} catch {
			showAlert(
				400,
				"Storage limit reached. Please remove some attachments before adding more.",
			);
		}
	};

	const handleAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		e.target.value = "";
		if (files.length === 0) return;

		Promise.all(
			files.map(
				(file) =>
					new Promise<string>((resolve) => {
						const reader = new FileReader();
						reader.onloadend = () => resolve(reader.result as string);
						reader.readAsDataURL(file);
					}),
			),
		).then((base64List) => {
			writeAttachments([...readAttachments(storageKey), ...base64List]);
		});
	};

	const handleRemoveAttachment = (index: number) => {
		writeAttachments(
			readAttachments(storageKey).filter((_, i) => i !== index),
		);
	};

	const handlePrint = () => {
		if (selectedWeekData) {
			const prev = document.title;
			document.title = getReportFileName(
				"WAR",
				selectedWeek,
				selectedWeekData.startDate,
				selectedWeekData.endDate,
				name,
			);
			window.print();
			document.title = prev;
		} else {
			window.print();
		}
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
			<AlertDialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto no-padding">
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
							multiple
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
					<div className="border border-border p-8  w-[221mm] print:w-[210mm] mx-auto no-padding">
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
							<div className="p-3">
								<p className="text-sm font-semibold text-slate-900 mb-1">
									Describe your internship experience this week:
								</p>
								<p className="no-print text-xs italic text-slate-500 mb-2">
									Note: leave blank and tap the
									<Sparkles className="inline h-3 w-3 mx-1 text-violet-600 align-text-bottom" />
									icon to let AI generate a summary from your daily entries.
								</p>
								<RichTextEditor
									value={overallDescription}
									onChange={handleDescriptionChange}
									placeholder="Write about your week..."
									rows={5}
									forceLight
									ai={{
										mode: "summarize",
										getEntries: () =>
											(selectedWeekData?.logs ?? [])
												.map((log) => stripHTMLToText(log.description ?? ""))
												.filter(Boolean),
									}}
									onAIError={(message) => showAlert(400, message)}
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
											<div
												className="rich-editor-content text-xs text-slate-900 leading-relaxed"
												dangerouslySetInnerHTML={{
													__html: sanitizeHTML(log.description),
												}}
											/>
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
									<div className="mb-1 relative h-16 w-full overflow-hidden">
										{supSignatureUrl && (
											<Image
												src={supSignatureUrl}
												alt="Supervisor Signature"
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
							</div>
						</div>

						{attachedImages.length > 0 && (
							<div className="border-x border-b border-gray-400 p-4">
								<p className="text-xs font-bold text-slate-900 mb-3">
									Attachments:
								</p>
								<div
									className={cn(
										"grid gap-3",
										attachedImages.length === 1
											? "grid-cols-1"
											: "grid-cols-2",
									)}
								>
									{attachedImages.map((img, index) => (
										<div
											key={index}
											className={cn(
												"relative group rounded p-2 bg-white",
												attachedImages.length > 1 && "border border-gray-300",
											)}
										>
											<button
												type="button"
												onClick={() => handleRemoveAttachment(index)}
												className="no-print absolute top-1 right-1 bg-white border border-gray-300 rounded-full p-1 text-slate-400 hover:text-red-500 hover:border-red-300 transition-colors shadow-sm opacity-0 group-hover:opacity-100"
											>
												<Trash2 className="h-3 w-3" />
											</button>
											<img
												src={img}
												alt={`Attachment ${index + 1}`}
												className={cn(
													"w-full object-contain rounded",
													attachedImages.length === 1
														? "max-h-150"
														: "max-h-64",
												)}
											/>
										</div>
									))}
								</div>
							</div>
						)}

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
