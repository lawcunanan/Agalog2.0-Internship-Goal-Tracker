import { ReactNode } from "react";
import { FadeIn } from "@/components/ui/fade-in";

interface StatCardProps {
	title: string;
	value: string | number;
	color: string; // e.g. 'bg-green-800'
	icon: ReactNode;
}

export function StatCard({ title, value, color, icon }: StatCardProps) {
	return (
		<FadeIn className="flex-1 bg-card border border-border rounded-lg p-4 flex items-center gap-3 max-w-57.5">
			<div
				className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${color}`}
			>
				{icon}
			</div>
			<div>
				<div className="text-xs text-muted-foreground font-medium">{title}</div>
				<div className="text-2xl font-bold text-foreground">{value}</div>
			</div>
		</FadeIn>
	);
}
