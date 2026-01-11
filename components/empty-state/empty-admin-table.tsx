"use client";

import { FadeIn } from "@/components/ui/fade-in";
import { FolderOpen } from "lucide-react";

export function EmptyAdminTable({
	title = "No records found",
	description = "Try adjusting your search or filters.",
}: {
	title?: string;
	description?: string;
}) {
	return (
		<FadeIn
			delay={0.2}
			className="flex flex-col items-center justify-center py-12 text-muted-foreground mb-8"
		>
			<FolderOpen className="h-12 w-12 mb-4 opacity-20" />
			<p className="font-medium text-foreground">{title}</p>
			<p className="text-sm">{description}</p>
		</FadeIn>
	);
}
