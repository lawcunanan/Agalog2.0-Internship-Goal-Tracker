"use client";

import { useState } from "react";
import { FadeIn } from "@/components/ui/fade-in";
import { WeeklyLogSelect } from "@/lib/types";
import { DescriptionCell } from "@/components/ui/description-cell";
import { EmptyLogs } from "@/components/empty-state/empty-logs";

interface WeeklyLogTableProps {
	data: WeeklyLogSelect[];
}

export function WeeklyLogTable({ data }: WeeklyLogTableProps) {
	const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

	if (!data || data.length === 0) {
		return <EmptyLogs />;
	}

	return (
		<FadeIn delay={0.2} className="space-y-12 mb-8">
			{data.map((week, weekIndex) => (
				<div key={`${week.weekLabel}-${weekIndex}`} className="space-y-6">
					<h3 className="text-xl font-semibold">{week.weekLabel}</h3>

					{/* Summary Grid */}
					<div className="grid grid-cols-3 text-sm text-muted-foreground pb-4 border-b gap-8">
						<div className="space-y-1">
							<span className="block text-xs uppercase tracking-wider opacity-70">
								Previous
							</span>
							<span className="block font-medium text-foreground text-lg">
								{week.previousHours}
							</span>
						</div>
						<div className="space-y-1">
							<span className="block text-xs uppercase tracking-wider opacity-70">
								This Period
							</span>
							<span className="block font-medium text-foreground text-lg">
								{week.thisPeriodHours}
							</span>
						</div>
						<div className="space-y-1">
							<span className="block text-xs uppercase tracking-wider opacity-70">
								Total
							</span>
							<span className="block font-medium text-foreground text-lg">
								{week.totalHours}
							</span>
						</div>
					</div>

					<div className="overflow-x-auto border border-border rounded-lg">
						<table className="w-full border-collapse">
							<thead className="bg-muted">
								<tr className="border-b border-border">
									{[
										"Date",
										"Time In",
										"Time Out",
										"Break Duration",
										"Total Hours",
										"Description",
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
								{week.logs.map((log) => (
									<tr
										key={log.log_id}
										className={`border-b border-x border-border hover:bg-muted/50 transition-colors ${
											expandedLogId === log.log_id ? "bg-muted/30" : ""
										}`}
									>
										<td className="py-4 px-4 text-xs sm:text-sm font-medium text-foreground min-w-30">
											{log.date}
										</td>
										<td className="py-4 px-4 text-xs sm:text-sm text-muted-foreground min-w-30">
											{log.timeIn}
										</td>
										<td className="py-4 px-4 text-xs sm:text-sm text-muted-foreground min-w-30">
											{log.timeOut}
										</td>
										<td className="py-4 px-4 text-xs sm:text-sm text-muted-foreground min-w-30">
											{log.breakDuration}
										</td>
										<td className="py-4 px-4 text-xs sm:text-sm font-medium text-blue-700 min-w-30">
											{log.hoursWorked}h
										</td>
										<td className="py-4 px-4 text-xs sm:text-sm text-muted-foreground min-w-100">
											<DescriptionCell description={log.description} />
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			))}
		</FadeIn>
	);
}
