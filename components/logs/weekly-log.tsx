"use client";

import { FadeIn } from "@/components/ui/fade-in";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Edit } from "lucide-react";
import { WeeklyLogSelect, LogValues } from "@/lib/types";
import { DeleteLogDialog } from "@/components/dialogs/logs/delete-log-dialog";
import { EmptyLogs } from "@/components/empty-state/empty-logs";

type WeeklyLogProps = {
	data: WeeklyLogSelect[];
	onEdit: (log: LogValues) => void;
	showAlert: (status: number, message: string) => void;
	refreshLogs: () => void;
};

export function WeeklyLog({
	data,
	onEdit,
	showAlert,
	refreshLogs,
}: WeeklyLogProps) {
	if (!data || data.length === 0) {
		return <EmptyLogs />;
	}

	return (
		<FadeIn delay={0.2} className="space-y-8 md:space-y-16 mb-8">
			{data.map((week, index) => (
				<div key={`${week.weekLabel}-${index}`} className="space-y-6">
					<h3 className="text-xl font-semibold">Week {week.weekLabel}</h3>

					<div className="grid grid-cols-3  gap-3 sm:gap-8 text-sm text-muted-foreground pb-4 border-b">
						<div className="space-y-1">
							<span className="block text-xs uppercase tracking-wider opacity-70">
								Previous
							</span>
							<span className="block font-medium text-foreground text-base sm:text-lg">
								{week.previousHours}
							</span>
						</div>

						<div className="space-y-1">
							<span className="block text-xs uppercase tracking-wider opacity-70">
								This Period
							</span>
							<span className="block font-medium text-foreground text-base sm:text-lg">
								{week.thisPeriodHours}
							</span>
						</div>

						<div className="space-y-1">
							<span className="block text-xs uppercase tracking-wider opacity-70">
								Total
							</span>
							<span className="block font-medium text-foreground text-base sm:text-lg">
								{week.totalHours}
							</span>
						</div>
					</div>

					<Accordion type="single" collapsible className="w-full space-y-1">
						{week.logs.map((log) => (
							<AccordionItem
								key={log.log_id}
								value={log.log_id}
								className="border-b-0"
							>
								<AccordionTrigger className="cursor-pointer hover:no-underline py-4 pr-3 pl-0 hover:pl-4 data-[state=open]:pl-4 hover:bg-muted/50 rounded-r-md transition-all duration-300 ease-out data-[state=open]:bg-muted/50 data-[state=open]:border-l-4 data-[state=open]:border-blue-700">
									<div className="grid grid-cols-5 gap-4 w-full text-left text-sm">
										<Tooltip>
											<TooltipTrigger asChild>
												<span className="font-medium">{log.date}</span>
											</TooltipTrigger>
											<TooltipContent>Date</TooltipContent>
										</Tooltip>

										<Tooltip>
											<TooltipTrigger asChild>
												<span className="text-muted-foreground">
													{log.timeIn}
												</span>
											</TooltipTrigger>
											<TooltipContent>Time In</TooltipContent>
										</Tooltip>

										<Tooltip>
											<TooltipTrigger asChild>
												<span className="text-muted-foreground">
													{log.timeOut}
												</span>
											</TooltipTrigger>
											<TooltipContent>Time Out</TooltipContent>
										</Tooltip>

										<Tooltip>
											<TooltipTrigger asChild>
												<span className="text-muted-foreground">
													{log.breakDuration}
												</span>
											</TooltipTrigger>
											<TooltipContent>Break Duration</TooltipContent>
										</Tooltip>

										<Tooltip>
											<TooltipTrigger asChild>
												<span className="font-medium text-blue-700">
													{log.hoursWorked}
												</span>
											</TooltipTrigger>
											<TooltipContent>Hours Worked</TooltipContent>
										</Tooltip>
									</div>
								</AccordionTrigger>

								<AccordionContent className="px-3 pb-4 pt-2 text-muted-foreground text-sm pl-4">
									<div className="flex justify-between items-start gap-3 sm:gap-6">
										<div className="flex-1">
											{log.description || "No description"}
										</div>

										<div className="flex items-center gap-1">
											<button
												type="button"
												onClick={(e) => {
													e.stopPropagation();
													onEdit(log);
												}}
												className="p-2 rounded-md hover:bg-foreground/5 transition-colors"
												aria-label="Edit attendance"
											>
												<Edit className="h-4 w-4 text-muted-foreground hover:text-green-500" />
											</button>

											<DeleteLogDialog
												log_id={log.log_id}
												showAlert={showAlert}
												refreshLogs={refreshLogs}
											/>
										</div>
									</div>
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
			))}
		</FadeIn>
	);
}
