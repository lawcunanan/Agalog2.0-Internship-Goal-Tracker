"use client";
import { useState, useEffect, useRef } from "react";
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
import { PaginationControls } from "@/components/pagination";
import { TodayLogSelect, Paginated } from "@/lib/types";
import { DescriptionCell } from "@/components/ui/description-cell";
import { EmptyAdminTable } from "@/components/empty-state/empty-admin-table";
import { refreshTodayLogs } from "@/services/csr/logs/refresh-today-logs";

type TodayLogsTabProps = {
	role: "Admin" | "Super Admin";
	goal_id: string | null;
	showAlert: (status: number, message: string) => void;
	initialData: Paginated<TodayLogSelect>;
	initialSections: string[];
};
export function TodayLogsTab({
	role,
	goal_id,
	showAlert,
	initialData,
	initialSections,
}: TodayLogsTabProps) {
	const [sectionFilter, setSectionFilter] = useState<string>("All Sections");
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [todayLogs, setTodayLogs] = useState<TodayLogSelect[]>(
		initialData.data,
	);
	const router = useRouter();

	//Pagination states
	const itemsPerPage = 10;
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(initialData.totalPages);

	const isFirstLoadRef = useRef(true);

	useEffect(() => {
		if (isFirstLoadRef.current) {
			isFirstLoadRef.current = false;
			return;
		}
		const fetchLogs = async () => {
			await refreshTodayLogs({
				goal_id,
				role,
				searchQuery,
				sectionFilter,
				itemsPerPage,
				currentPage,
				showAlert,
				setTodayLogsData: setTodayLogs,
				setTotalPages,
			});
		};

		fetchLogs();
	}, [goal_id, role, searchQuery, sectionFilter, currentPage]);

	return (
		<FadeIn className="space-y-6 mt-4">
			<div className="flex flex-row gap-3 mb-4">
				<div className="relative w-full md:w-80">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
					<Input
						placeholder="Search by name..."
						className="pl-10 shadow-none w-full"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
				{initialSections.length > 0 && (
					<Select value={sectionFilter} onValueChange={setSectionFilter}>
						<SelectTrigger className="md:w-42">
							<span className="hidden md:inline">
								<SelectValue placeholder="Filter by section" />
							</span>
						</SelectTrigger>
						<SelectContent>
							{initialSections?.map((section) => (
								<SelectItem key={section} value={section}>
									{section}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				)}
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
									className="text-left py-3 px-4 font-medium text-foreground text-sm"
								>
									{header}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{todayLogs?.length > 0 ? (
							todayLogs.map((log, idx) => {
								const recordUrl = `/record/${goal_id ?? "null"}/${log.user_id}`;
								return (
									<tr
										key={idx}
										className="border-b border-border hover:bg-muted/50 transition-colors cursor-pointer"
										onMouseEnter={() => {
											router.prefetch(recordUrl);
										}}
										onClick={() => {
											router.push(recordUrl);
										}}
									>
										<td className="py-4 px-4 min-w-20">
											<Avatar className="w-9 h-9">
												<AvatarImage src={log.avatar_url} alt={log.fullname} />
												<AvatarFallback className="bg-muted text-sm font-semibold text-muted-foreground">
													{log?.fullname?.charAt(0) || "U"}
												</AvatarFallback>
											</Avatar>
										</td>

										<td className="py-4 px-4 text-sm text-foreground min-w-50">
											{log.fullname || "N/A"}
										</td>

										<td className="py-4 px-4 text-sm text-foreground min-w-30">
											{log.section || "N/A"}
										</td>

										<td className="py-4 px-4 text-sm text-foreground min-w-30">
											{log.date || "N/A"}
										</td>

										<td className="py-4 px-4 text-sm text-foreground min-w-30">
											{log.timeIn || "N/A"}
										</td>

										<td className="py-4 px-4 text-sm text-foreground min-w-30">
											{log.timeOut || "N/A"}
										</td>

										<td className="py-4 px-4 text-sm text-foreground min-w-35">
											{log.breakDuration || "N/A"}
										</td>

										<td className="py-4 px-4 text-sm text-muted-foreground min-w-50">
											<DescriptionCell description={log.description || ""} />
										</td>

										<td className="py-4 px-4 text-sm text-foreground font-medium min-w-30">
											{log.hoursWorked || "N/A"}
										</td>

										<td className="py-4 px-4 text-sm text-foreground min-w-52.5">
											{log.createdAt}
										</td>
									</tr>
								);
							})
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
