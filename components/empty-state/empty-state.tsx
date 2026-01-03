import { FolderOpen } from "lucide-react";

export function EmptyState({
	title = "Nothing here yet",
	description = "No data available at the moment.",
}: {
	title?: string;
	description?: string;
}) {
	return (
		<div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-muted-foreground">
			<FolderOpen className="h-10 w-10 opacity-60" />
			<p className="text-sm font-medium text-foreground">{title}</p>
			<p className="text-xs max-w-xs">{description}</p>
		</div>
	);
}
