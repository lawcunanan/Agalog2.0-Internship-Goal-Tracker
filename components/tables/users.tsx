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
import { UserSelect, Paginated } from "@/lib/types";
import { EmptyAdminTable } from "@/components/empty-state/empty-admin-table";
import { refreshUsers } from "@/services/csr/users/refresh-users";

export function UsersTab({
	showAlert,
	initialData,
}: {
	showAlert: (status: number, message: string) => void;
	initialData: Paginated<UserSelect>;
}) {
	const [statusFilter, setStatusFilter] = useState<string>("All Status");
	const [roleFilter, setRoleFilter] = useState<string>("All Roles");
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [usersData, setUsersData] = useState<UserSelect[]>(initialData.data);
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

		const fetchUsers = async () => {
			await refreshUsers({
				searchQuery,
				statusFilter,
				roleFilter,
				itemsPerPage,
				currentPage,
				showAlert,
				setUsersData,
				setTotalPages,
			});
		};

		fetchUsers();
	}, [searchQuery, statusFilter, roleFilter, currentPage]);

	useEffect(() => {
		usersData
			.filter((user) => user.role === "Student")
			.forEach((user) => {
				router.prefetch(`/record/null/${user.user_id}`);
			});
	}, [usersData, router]);

	return (
		<FadeIn className="space-y-6 mt-2">
			<div className="flex flex-row gap-3 mb-4">
				<div className="relative w-full md:w-80">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
					<Input
						placeholder="Search by name or email..."
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

				<Select value={roleFilter} onValueChange={setRoleFilter}>
					<SelectTrigger className="md:w-42">
						<span className="hidden md:inline">
							<SelectValue placeholder="Filter by role" />
						</span>
					</SelectTrigger>
					<SelectContent>
						{["All Roles", "Student", "Admin"].map((role) => (
							<SelectItem key={role} value={role}>
								{role}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div className="overflow-x-auto border border-border rounded-lg">
				<table className="w-full border-collapse">
					<thead>
						<tr className="border-b border-border bg-muted">
							{["Profile", "Name", "Status", "Role", "Email", "Created At"].map(
								(header) => (
									<th
										key={header}
										className="text-left py-3 px-4 font-medium text-foreground text-sm"
									>
										<span className="flex items-center gap-2">{header}</span>
									</th>
								),
							)}
						</tr>
					</thead>
					<tbody>
						{usersData.length > 0 ? (
							usersData.map((user, idx) => {
								const recordUrl = `/record/null/${user.user_id}`;
								return (
									<tr
										key={idx}
										className={`border-b border-border hover:bg-muted/50 transition-colors ${
											user.role === "Student" ? "cursor-pointer" : ""
										}`}
										onMouseEnter={
											user.role === "Student"
												? () => {
														router.prefetch(recordUrl);
													}
												: undefined
										}
										onClick={
											user.role === "Student"
												? () => {
														router.push(recordUrl);
													}
												: undefined
										}
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
										<td className="py-4 px-4 text-sm text-foreground min-w-30">
											{user.fullname || "N/A"}
										</td>
										<td className="py-4 px-4 text-sm text-foreground min-w-30">
											{user.status || "N/A"}
										</td>
										<td className="py-4 px-4 text-sm text-foreground min-w-30">
											{user.role || "N/A"}
										</td>
										<td className="py-4 px-4 text-sm text-foreground min-w-50">
											{user.email || "N/A"}
										</td>
										<td className="py-4 px-4 text-sm text-foreground min-w-30">
											{user.createdAt || "N/A"}
										</td>
									</tr>
								);
							})
						) : (
							<tr>
								<td colSpan={6} className="py-12">
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
