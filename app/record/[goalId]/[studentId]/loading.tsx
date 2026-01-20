import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
	return (
		<div className="flex flex-col min-h-screen bg-background">
			<Header />
			<main className="flex-1 w-full max-w-300 mx-auto px-4 md:px-6 pt-28 space-y-9">
				{/* Student Profile Header Skeleton */}
				<div className="flex  items-start gap-4">
					<Skeleton className="size-42  rounded-lg hidden sm:block" />
					<div className="flex-1 space-y-2 ">
						<Skeleton className="h-20 w-80" />
						<Skeleton className="h-12 w-62" />
					</div>
				</div>

				{/* Progress Section Skeleton */}
				<Skeleton className="h-32 w-full rounded-xl col-span-2" />

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
