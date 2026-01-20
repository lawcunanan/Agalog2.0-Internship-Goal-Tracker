import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
	return (
		<div className="flex flex-col min-h-screen bg-background">
			<Header />
			<main className="flex-1 container max-w-5xl mx-auto py-6 px-4 space-y-6">
				{/* Student Profile Header Skeleton */}
				<div className="flex items-center gap-4">
					<Skeleton className="size-16 rounded-full" />
					<div className="space-y-2">
						<Skeleton className="h-6 w-48" />
						<Skeleton className="h-4 w-32" />
					</div>
				</div>

				{/* Progress Section Skeleton */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<Skeleton className="h-32 w-full rounded-xl" />
					<Skeleton className="h-32 w-full rounded-xl col-span-2" />
				</div>

				{/* Filters/Toolbar Skeleton */}
				<div className="flex justify-between items-center h-10 mt-6">
					<Skeleton className="h-10 w-64" />
					<Skeleton className="h-10 w-32" />
				</div>

				{/* Table Skeleton */}
				<div className="space-y-4 border rounded-lg p-4">
					<div className="flex justify-between border-b pb-4">
						{Array.from({ length: 5 }).map((_, i) => (
							<Skeleton key={i} className="h-4 w-20" />
						))}
					</div>
					{Array.from({ length: 5 }).map((_, i) => (
						<Skeleton key={i} className="h-12 w-full" />
					))}
				</div>
			</main>
			<Footer />
		</div>
	);
}
