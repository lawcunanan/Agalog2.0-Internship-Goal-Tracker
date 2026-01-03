"use client";
import { useState, useEffect, use } from "react";
import { FadeIn } from "@/components/ui/fade-in";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { PaginationControls } from "@/components/pagination-controls";
import { GoalsSelect } from "@/lib/types";
import { getGoals } from "@/services/admin/select-goals";
import { EmptyAdminTable } from "@/components/empty-state/empty-admin-table";

export function GoalsTab({
	showAlert,
}: {
	showAlert: (status: number, message: string) => void;
}) {
	const [statusFilter, setStatusFilter] = useState<string>("All Status");
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [goalsData, setGoalsData] = useState<GoalsSelect[]>([]);

	//Pagination states\
	const itemsPerPage = 10;
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(5);

	useEffect(() => {
		getGoals(
			setGoalsData,
			searchQuery,
			statusFilter,
			itemsPerPage,
			currentPage,
			setTotalPages,
			showAlert,
		);
	}, [searchQuery, statusFilter, currentPage]);

	return (
		<FadeIn className="space-y-6 mt-4">
			<div className="flex flex-row md:items-center gap-3 mb-4">
				<div className="relative w-full md:w-64">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
					<Input
						placeholder="Search by title..."
						className="pl-10 shadow-none w-full"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
				<div className="md:w-48">
					<Select value={statusFilter} onValueChange={setStatusFilter}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Filter by status" />
						</SelectTrigger>
						<SelectContent>
							{["All Status", "Active", "Inactive"].map((status) => (
								<SelectItem key={status} value={status}>
									{status}
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
								"Title",
								"Status",
								"Goal Hours",
								"Created By",
								"Created Date",
							].map((header) => (
								<th
									key={header}
									className="text-left py-3 px-4 font-medium text-foreground text-xs sm:text-sm"
								>
									<span className="flex items-center gap-2">{header}</span>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{goalsData.length ? (
							goalsData.map((goal, idx) => (
								<tr
									key={idx}
									className="border-b border-border hover:bg-muted/50 transition-colors"
								>
									<td className="py-4 px-4 text-xs sm:text-sm text-foreground min-w-30">
										{goal.title}
									</td>
									<td className="py-4 px-4 text-xs sm:text-sm text-foreground min-w-30">
										{goal.status}
									</td>
									<td className="py-4 px-4 text-xs sm:text-sm text-foreground min-w-30">
										{goal.goalHours} hrs
									</td>
									<td className="py-4 px-4 text-xs sm:text-sm text-foreground min-w-30">
										{goal.createdBy}
									</td>
									<td className="py-4 px-4 text-xs sm:text-sm text-foreground min-w-30">
										{goal.createdDate}
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={5} className="py-12">
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
