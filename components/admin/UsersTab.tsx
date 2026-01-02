"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { UsersSelect } from "@/lib/types";
import { getUsers } from "@/services/admin/select-users";

export function UsersTab({
	showAlert,
}: {
	showAlert: (status: number, message: string) => void;
}) {
	const [statusFilter, setStatusFilter] = useState<string>("All Status");
	const [roleFilter, setRoleFilter] = useState<string>("All Roles");
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [usersData, setUsersData] = useState<UsersSelect[]>([]);
	const router = useRouter();

	//Pagination states
	const itemsPerPage = 10;
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(5);

	useEffect(() => {
		getUsers(
			setUsersData,
			searchQuery,
			statusFilter,
			roleFilter,
			itemsPerPage,
			currentPage,
			setTotalPages,
			showAlert,
		);
	}, [searchQuery, statusFilter, roleFilter, currentPage]);

	return (
		<div className="space-y-6 mt-4">
			<div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
				<div className="relative w-full md:w-64">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
					<Input
						placeholder="Search by name or email..."
						className="pl-10 shadow-none w-full"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
				<div className="w-full md:w-48">
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
				<div className="w-full md:w-48">
					<Select value={roleFilter} onValueChange={setRoleFilter}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Filter by role" />
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
			</div>
			<div className="overflow-x-auto border border-border rounded-lg">
				<table className="w-full border-collapse">
					<thead>
						<tr className="border-b border-border bg-muted">
							{["Profile", "Name", "Status", "Role", "Email", "Created At"].map(
								(header) => (
									<th
										key={header}
										className="text-left py-3 px-4 font-medium text-foreground text-xs sm:text-sm"
									>
										<span className="flex items-center gap-2">{header}</span>
									</th>
								),
							)}
						</tr>
					</thead>
					<tbody>
						{usersData.length > 0 ? (
							usersData.map((user, idx) => (
								<tr
									key={idx}
									className={`border-b border-border hover:bg-muted/50 transition-colors ${
										user.role === "Student" ? "cursor-pointer" : ""
									}`}
									onClick={() => {
										if (user.role === "Student") {
											router.push(`/student/null/${user.user_id}`);
										}
									}}
								>
									<td className="py-4 px-4 min-w-20">
										<Avatar className="w-9 h-9">
											<AvatarImage src={user.picture} alt={user.fullname} />
											<AvatarFallback className="bg-muted text-xs font-semibold text-muted-foreground">
												{user.fullname.charAt(0)}
											</AvatarFallback>
										</Avatar>
									</td>
									<td className="py-4 px-4 text-xs sm:text-sm text-foreground min-w-25">
										{user.fullname}
									</td>
									<td className="py-4 px-4 text-xs sm:text-sm text-foreground min-w-25">
										{user.status}
									</td>
									<td className="py-4 px-4 text-xs sm:text-sm text-foreground min-w-25">
										{user.role}
									</td>
									<td className="py-4 px-4 text-xs sm:text-sm text-foreground min-w-50">
										{user.email}
									</td>
									<td className="py-4 px-4 text-xs sm:text-sm text-foreground min-w-30">
										{user.createdAt}
									</td>
								</tr>
							))
						) : (
							<tr>
								<td
									colSpan={6}
									className="py-4 px-4 text-center text-xs sm:text-sm text-foreground"
								>
									No users found.
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
