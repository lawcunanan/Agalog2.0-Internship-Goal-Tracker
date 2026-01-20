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
import { UserSummarySelect } from "@/lib/types";
import { EmptyAdminTable } from "@/components/empty-state/empty-admin-table";
import { refreshUserSummary } from "@/services/csr/users/refresh-user-summary";

type UserSummaryTabProps = {
	goal_id: string | null;
	showAlert: (status: number, message: string) => void;
	initialData: UserSummarySelect[];
	initialCompanies: string[];
	initialSections: string[];
};

export function UserSummaryTab({
	goal_id,
	showAlert,
	initialData,
	initialCompanies,
	initialSections,
}: UserSummaryTabProps) {
	const [sectionFilter, setSectionFilter] = useState<string>("All Sections");
	const [companyFilter, setCompanyFilter] = useState<string>("All Companies");
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [userSummaryData, setUserSummaryData] =
		useState<UserSummarySelect[]>(initialData);
	const router = useRouter();

	//Pagination states
	const itemsPerPage = 10;
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(5);

	const isFirstLoadRef = useRef(true);

	useEffect(() => {
		if (isFirstLoadRef.current) {
			isFirstLoadRef.current = false;
			return;
		}

		const fetchSummary = async () => {
			await refreshUserSummary({
				goal_id,
				searchQuery,
				sectionFilter,
				companyFilter,
				itemsPerPage,
				currentPage,
				showAlert,
				setSummaryData: setUserSummaryData,
				setTotalPages,
			});
		};

		fetchSummary();
	}, [goal_id, searchQuery, sectionFilter, companyFilter, currentPage]);

	return (
		<FadeIn className="space-y-6 mt-4">
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
				<div className="flex gap-3">
					{initialSections.length > 0 && (
						<div className="w-full md:w-48">
							<Select value={sectionFilter} onValueChange={setSectionFilter}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Filter by section" />
								</SelectTrigger>
								<SelectContent>
									{initialSections.map((section) => (
										<SelectItem key={section} value={section}>
											{section}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)}

					{initialCompanies.length > 0 && (
						<div className="w-full md:w-48">
							<Select value={companyFilter} onValueChange={setCompanyFilter}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Filter by company" />
								</SelectTrigger>
								<SelectContent>
									{initialCompanies.map((company) => (
										<SelectItem key={company} value={company}>
											{company}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)}
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
									className="text-left py-3 px-4 font-medium text-foreground text-sm"
								>
									<span className="flex items-center gap-2">{header}</span>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{userSummaryData?.length > 0 ? (
							userSummaryData.map((user, idx) => {
								const recordUrl = `/record/${goal_id ?? "null"}/${user.user_id}`;
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
												<AvatarImage
													src={user.avatar_url}
													alt={user.fullname}
												/>
												<AvatarFallback className="bg-muted text-sm font-semibold text-muted-foreground">
													{user?.fullname?.charAt(0) || "U"}
												</AvatarFallback>
											</Avatar>
										</td>
										<td className="py-4 px-4 text-sm text-foreground min-w-50">
											{user.fullname || "N/A"}
										</td>
										<td className="py-4 px-4 text-sm text-foreground min-w-30">
											{user.section || "N/A"}
										</td>
										<td className="py-4 px-4 text-sm text-foreground min-w-25">
											{user.company || "N/A"}
										</td>
										<td className="py-4 px-4 text-sm text-foreground min-w-30">
											{user.goalTitle || "N/A"}
										</td>
										<td className="py-4 px-4 text-sm text-foreground min-w-30">
											{user.goalHours + "hrs"}
										</td>
										<td className="py-4 px-4 text-sm font-medium text-foreground min-w-30">
											{user.totalHours || "N/A"}
										</td>
										<td className="py-4 px-4 text-sm font-medium text-foreground min-w-30">
											{user.hoursLeft || "N/A"}
										</td>
									</tr>
								);
							})
						) : (
							<tr>
								<td colSpan={8} className="py-12">
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
