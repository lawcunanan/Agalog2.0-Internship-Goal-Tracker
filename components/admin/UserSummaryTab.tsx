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

const userSummaryDummyData = [
	{
		picture: "https://randomuser.me/api/portraits/men/33.jpg",
		fullname: "Chris Evans",
		section: "Section C",
		company: "Gamma LLC",
		goalNumber: "G-001",
		goalHours: "400",
		totalHours: "320",
		hoursLeft: "80",
	},
	{
		picture: "https://randomuser.me/api/portraits/women/55.jpg",
		fullname: "Lisa Ray",
		section: "Section D",
		company: "Delta Ltd",
		goalNumber: "D-002",
		goalHours: "350",
		totalHours: "300",
		hoursLeft: "50",
	},
];

interface UserSummaryTabProps {
	picture: string;
	fullname: string;
	section: string;
	company: string;
	goalNumber: string;
	goalHours: string;
	totalHours: string;
	hoursLeft: string;
}

export function UserSummaryTab() {
	const [sectionFilter, setSectionFilter] = useState<string>("All");
	const [companyFilter, setCompanyFilter] = useState<string>("All");
	const [sectionData, setSectionData] = useState<string[]>([
		"All",
		"Section A",
		"Section B",
		"Section C",
		"Section D",
	]);
	const [companyData, setCompanyData] = useState<string[]>([
		"All",
		"Acme Corp",
		"Beta Inc",
		"Gamma LLC",
		"Delta Ltd",
	]);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [userSummaryData, setUserSummaryData] =
		useState<UserSummaryTabProps[]>(userSummaryDummyData);
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
								"Goal Number",
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
										{user.goalNumber}
									</td>
									<td className="py-4 px-4 text-xs sm:text-sm text-foreground min-w-30">
										{user.goalHours}
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
				currentPage={1}
				totalPages={5}
				onPageChange={() => {}}
			/>
		</div>
	);
}
