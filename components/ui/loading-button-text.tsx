import { Loader2 } from "lucide-react";

interface LoadingButtonTextProps {
	isLoading: boolean;
	loadingTitle: string;
	title: string;
}

export function LoadingButtonText({
	isLoading,
	loadingTitle,
	title,
}: LoadingButtonTextProps) {
	return isLoading ? (
		<>
			<Loader2 className="mr-2 h-4 w-4 animate-spin" />
			{loadingTitle}
		</>
	) : (
		<>{title}</>
	);
}
