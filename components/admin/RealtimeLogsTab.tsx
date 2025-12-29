"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { PaginationControls } from "@/components/pagination=controls";

const realtimeLogsDummyData = [
	{
		picture: "https://randomuser.me/api/portraits/men/11.jpg",
		fullname: "Alex Johnson",
		section: "Section A",
		date: "2025-12-29",
		timeIn: "08:00",
		timeOut: "17:00",
		breakDuration: "1h",
		description: "Worked on project X",
		hoursWorked: "8",
		createdAt: "2025-12-29 17:05",
	},
	{
		picture: "https://randomuser.me/api/portraits/women/22.jpg",
		fullname: "Maria Lee",
		section: "Section B",
		date: "2025-12-29",
		timeIn: "09:00",
		timeOut: "18:00",
		breakDuration: "1h",
		description: "Documentation",
		hoursWorked: "8",
		createdAt: "2025-12-29 18:05",
	},
	{
		picture: "https://randomuser.me/api/portraits/women/22.jpg",
		fullname: "Maria Lee",
		section: "Section B",
		date: "2025-12-29",
		timeIn: "09:00",
		timeOut: "18:00",
		breakDuration: "1h",
		description: "Documentation",
		hoursWorked: "8",
		createdAt: "2025-12-29 18:05",
	},
];

interface RealtimeLogsTabProps {
	picture: string;
	fullname: string;
	section: string;
	date: string;
	timeIn: string;
	timeOut: string;
	breakDuration: string;
	description: string;
	hoursWorked: string;
	createdAt: string;
}

export function RealtimeLogsTab() {
	const [sectionFilter, setSectionFilter] = useState<string>("All Sections");
	const [sectionData, setSectionData] = useState<string[]>([
		"All Sections",
		"Section A",
		"Section B",
		"Section C",
	]);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [logsData, setLogsData] = useState<RealtimeLogsTabProps[]>(
		realtimeLogsDummyData,
	);

	return (
		<div className="space-y-6 mt-4">
			<div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
				<div className="relative w-full md:w-64">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
					<Input
						placeholder="Search by name..."
						className="pl-10 shadow-none w-full"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
				<div className="w-full md:w-48">
					<Select value={sectionFilter} onValueChange={setSectionFilter}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Filter by section" />
						</SelectTrigger>
						<SelectContent>
							{sectionData.map((section) => (
								<SelectItem key={section} value={section}>
									{section}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>
			<div className="overflow-x-auto border border-border rounded-lg">
				<table className="w-full border-collapse">
					<thead>
						<tr className="border-b border-border bg-muted">
							{[
								"Profile",
								"Student Name",
								"Section",
								"Date",
								"Time In",
								"Time Out",
								"Break Duration",
								"Description",
								"Total Hours",
								"Created At",
							].map((header) => (
								<th
									key={header}
									className="text-left py-3 px-4 font-medium text-foreground text-xs sm:text-sm"
								>
									{header}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{logsData.length > 0 ? (
							logsData.map((log, idx) => (
								<tr
									key={idx}
									className="border-b border-border hover:bg-muted/50 transition-colors cursor-pointer"
								>
									<td className="py-4 px-4 min-w-20">
										<Avatar className="w-9 h-9">
											<AvatarImage src={log.picture} alt={log.fullname} />
											<AvatarFallback className="bg-muted text-xs font-semibold text-muted-foreground">
												{log.fullname.charAt(0)}
											</AvatarFallback>
										</Avatar>
									</td>
									<td className="py-4 px-4 text-xs sm:text-sm text-foreground min-w-50">
										{log.fullname}
									</td>
									<td className="py-4 px-4 text-xs sm:text-sm text-foreground min-w-30">
										{log.section}
									</td>
									<td className="py-4 px-4 text-xs sm:text-sm text-foreground min-w-25">
										{log.date}
									</td>
									<td className="py-4 px-4 text-xs sm:text-sm text-foreground min-w-25">
										{log.timeIn}
									</td>
									<td className="py-4 px-4 text-xs sm:text-sm text-foreground min-w-25">
										{log.timeOut}
									</td>
									<td className="py-4 px-4 text-xs sm:text-sm text-foreground min-w-35">
										{log.breakDuration}
									</td>
									<td className="py-4 px-4 text-xs sm:text-sm text-muted-foreground min-w-50">
										{log.description}
									</td>
									<td className="py-4 px-4 text-xs sm:text-sm text-foreground font-medium min-w-30">
										{log.hoursWorked}
									</td>
									<td className="py-4 px-4 text-xs sm:text-sm text-foreground min-w-52.5">
										{log.createdAt}
									</td>
								</tr>
							))
						) : (
							<tr>
								<td
									colSpan={10}
									className="py-4 px-4 text-center text-xs sm:text-sm text-foreground"
								>
									No logs found.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
			<PaginationControls
				currentPage={1}
				totalPages={5}
				onPageChange={() => {}}
			/>
		</div>
	);
}
