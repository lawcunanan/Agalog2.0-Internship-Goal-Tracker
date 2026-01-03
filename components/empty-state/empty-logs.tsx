"use client";

import { FadeIn } from "@/components/ui/fade-in";
import { CalendarX } from "lucide-react";

export function EmptyLogs() {
	return (
		<FadeIn
			delay={0.2}
			className="flex flex-col items-center justify-center py-12 text-muted-foreground mb-8"
		>
			<CalendarX className="h-12 w-12 mb-4 opacity-20" />
			<p>No attendance records found.</p>
		</FadeIn>
	);
}
