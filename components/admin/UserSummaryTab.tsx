"use client";
import { useState, useEffect } from "react";
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
import { UserSummarySelect } from "@/lib/types";
import { getUserSummary } from "@/services/admin/select-user-summary";

export function UserSummaryTab({
	goalId,
	showAlert,
}: {
	goalId: string | null;
	showAlert: (status: number, message: string) => void;
}) {
	const [sectionFilter, setSectionFilter] = useState<string>("All Sections");
	const [companyFilter, setCompanyFilter] = useState<string>("All Companies");
	const [sectionData, setSectionData] = useState<string[]>([
		"All Sections",
		"ITE 222",
		"Section B",
		"Section C",
		"Section D",
	]);
	const [companyData, setCompanyData] = useState<string[]>([
		"All Companies",
		"Acme Corp",
		"Beta Inc",
		"Gamma LLC",
		"Delta Ltd",
	]);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [userSummaryData, setUserSummaryData] = useState<UserSummarySelect[]>(
		[],
	);

	//Pagination states\
	const itemsPerPage = 10;
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(5);

	useEffect(() => {
		getUserSummary(
			goalId,
			setUserSummaryData,
			searchQuery,
			sectionFilter,
			companyFilter,
			itemsPerPage,
			currentPage,
			setTotalPages,
			showAlert,
		);
	}, [goalId, searchQuery, sectionFilter, companyFilter, currentPage]);
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
				<div className="w-full md:w-48">
					<Select value={companyFilter} onValueChange={setCompanyFilter}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Filter by company" />
						</SelectTrigger>
						<SelectContent>
							{companyData.map((company) => (
								<SelectItem key={company} value={company}>
									{company}
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
								"Company",
								"Goal Title",
								"Goal Hours",
								"Total Hours",
								"Hours Left",
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
						{userSummaryData.length > 0 ? (
							userSummaryData.map((user, idx) => (
								<tr
									key={idx}
									className="border-b border-border hover:bg-muted/50 transition-colors cursor-pointer"
								>
									<td className="py-4 px-4 min-w-20">
										<Avatar className="w-9 h-9">
											<AvatarImage src={user.picture} alt={user.fullname} />
											<AvatarFallback className="bg-muted text-xs font-semibold text-muted-foreground">
												{user.fullname.charAt(0)}
											</AvatarFallback>
										</Avatar>
									</td>
									<td className="py-4 px-4 text-xs sm:text-sm text-foreground min-w-50">
										{user.fullname}
									</td>
									<td className="py-4 px-4 text-xs sm:text-sm text-foreground min-w-30">
										{user.section}
									</td>
									<td className="py-4 px-4 text-xs sm:text-sm text-foreground min-w-25">
										{user.company}
									</td>
									<td className="py-4 px-4 text-xs sm:text-sm text-foreground min-w-30">
										{user.goalTitle}
									</td>
									<td className="py-4 px-4 text-xs sm:text-sm text-foreground min-w-30">
										{user.goalHours + "hrs"}
									</td>
									<td className="py-4 px-4 text-xs sm:text-sm font-medium text-foreground min-w-30">
										{user.totalHours}
									</td>
									<td className="py-4 px-4 text-xs sm:text-sm font-medium text-foreground min-w-30">
										{user.hoursLeft}
									</td>
								</tr>
							))
						) : (
							<tr>
								<td
									colSpan={8}
									className="py-4 px-4 text-center text-xs sm:text-sm text-foreground"
								>
									No user summaries found.
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
		</div>
	);
}
