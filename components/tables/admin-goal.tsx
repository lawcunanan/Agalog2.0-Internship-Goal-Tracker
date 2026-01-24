"use client";

import { useState, useEffect, useRef } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PaginationControls } from "@/components/pagination";
import { GoalAdminSelect, Paginated } from "@/lib/types";
import { EmptyAdminTable } from "@/components/empty-state/empty-admin-table";
import { refreshGoalAdmins } from "@/services/csr/users/refresh-goal-admins";

type GoalAdminTabProps = {
	goal_id: string | null;
	showAlert: (status: number, message: string) => void;
	initialData: Paginated<GoalAdminSelect>;
};
export function GoalAdminTab({
	goal_id,
	showAlert,
	initialData,
}: GoalAdminTabProps) {
	const [statusFilter, setStatusFilter] = useState<string>("All Status");
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [adminsData, setAdminsData] = useState<GoalAdminSelect[]>(
		initialData.data,
	);

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

		const fetchAdmins = async () => {
			await refreshGoalAdmins({
				goal_id,
				searchQuery,
				statusFilter,
				itemsPerPage,
				currentPage,
				showAlert,
				setAdminsData,
				setTotalPages,
			});
		};

		fetchAdmins();
	}, [goal_id, searchQuery, statusFilter, currentPage]);

	return (
		<FadeIn className="space-y-6 mt-2">
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

				<Select value={statusFilter} onValueChange={setStatusFilter}>
					<SelectTrigger className="md:w-42">
						<span className="hidden md:inline">
							<SelectValue placeholder="Filter by status" />
						</span>
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
			<div className="overflow-x-auto border border-border rounded-lg">
				<table className="w-full border-collapse">
					<thead>
						<tr className="border-b border-border bg-muted">
							{["Profile", "Name", "Email", "Role", "Status", "Created At"].map(
								(header) => (
									<th
										key={header}
										className="text-left py-3 px-4 font-medium text-foreground text-sm"
									>
										{header}
									</th>
								),
							)}
						</tr>
					</thead>
					<tbody>
						{adminsData?.length > 0 ? (
							adminsData.map((admin, idx) => (
								<tr
									key={idx}
									className="border-b border-border hover:bg-muted/50 transition-colors"
								>
									<td className="py-4 px-4 min-w-20">
										<Avatar className="w-9 h-9">
											<AvatarImage
												src={admin.avatar_url}
												alt={admin.fullname}
											/>
											<AvatarFallback className="bg-muted text-sm font-semibold text-muted-foreground">
												{admin?.fullname?.charAt(0) || "A"}
											</AvatarFallback>
										</Avatar>
									</td>
									<td className="py-4 px-4 text-sm text-foreground min-w-30">
										{admin.fullname || "N/A"}
									</td>
									<td className="py-4 px-4 text-sm text-foreground min-w-30">
										{admin.email || "N/A"}
									</td>
									<td className="py-4 px-4 text-sm text-foreground min-w-30">
										{admin.role || "N/A"}
									</td>
									<td className="py-4 px-4 text-sm text-foreground min-w-30">
										{admin.status || "N/A"}
									</td>

									<td className="py-4 px-4 text-sm text-foreground min-w-30">
										{admin.createdAt}
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={7} className="py-12">
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
