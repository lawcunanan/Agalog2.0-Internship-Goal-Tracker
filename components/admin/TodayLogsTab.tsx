"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FadeIn } from "@/components/ui/fade-in";
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
import { PaginationControls } from "@/components/pagination-controls";
import { TodayLogsSelect } from "@/lib/types";
import { getTodayLogs } from "@/services/admin/select-today-logs";
import { getSectionCompany } from "@/services/filter/select-section-company";
import { DescriptionCell } from "@/components/ui/description-cell";
import { EmptyAdminTable } from "@/components/empty-state/empty-admin-table";

export function TodayLogsTab({
	role,
	goalId,
	showAlert,
}: {
	role: "Admin" | "Super Admin";
	goalId: string | null;
	showAlert: (status: number, message: string) => void;
}) {
	const [sectionFilter, setSectionFilter] = useState<string>("All Sections");
	const [sectionData, setSectionData] = useState<string[]>([]);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [todayLogs, setTodayLogs] = useState<TodayLogsSelect[]>([]);
	const router = useRouter();

	//Pagination states\
	const itemsPerPage = 10;
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(5);

	useEffect(() => {
		if (!goalId && role == "Admin") return;
		getTodayLogs(
			goalId,
			setTodayLogs,
			searchQuery,
			sectionFilter,
			itemsPerPage,
			currentPage,
			setTotalPages,
			showAlert,
		);
	}, [goalId, role, searchQuery, sectionFilter, currentPage]);

	useEffect(() => {
		if (!goalId && role == "Admin") return;
		getSectionCompany(goalId!, setSectionData, undefined, showAlert);
	}, [goalId, role]);

	return (
		<FadeIn className="space-y-6 mt-4">
			<div className="flex flex-row md:items-center gap-3 mb-4">
				<div className="relative w-full md:w-64">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
					<Input
						placeholder="Search by name..."
						className="pl-10 shadow-none w-full"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
				<div className="md:w-48">
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
						{todayLogs.length > 0 ? (
							todayLogs.map((log, idx) => (
								<tr
									key={idx}
									className="border-b border-border hover:bg-muted/50 transition-colors cursor-pointer"
									onClick={() =>
										router.push(`/student/${goalId || "null"}/${log.user_id}`)
									}
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
									<td className="py-4 px-4 text-xs sm:text-sm text-foreground min-w-30">
										{log.date}
									</td>
									<td className="py-4 px-4 text-xs sm:text-sm text-foreground min-w-30">
										{log.timeIn}
									</td>
									<td className="py-4 px-4 text-xs sm:text-sm text-foreground min-w-30">
										{log.timeOut}
									</td>
									<td className="py-4 px-4 text-xs sm:text-sm text-foreground min-w-35">
										{log.breakDuration}
									</td>
									<td className="py-4 px-4 text-xs sm:text-sm text-muted-foreground min-w-50">
										<DescriptionCell description={log.description} />
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
								<td colSpan={10} className="py-12">
									<EmptyAdminTable />
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
			<PaginationControls
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={(page) => setCurrentPage(page)}
			/>
		</FadeIn>
	);
}
