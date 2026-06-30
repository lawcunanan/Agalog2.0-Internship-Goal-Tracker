import { cn } from "@/lib/utils";

type GridBackgroundProps = {
	className?: string;
	/** Use a dot grid instead of the line grid */
	variant?: "grid" | "dot";
	/** Slowly pan the grid for a subtle "alive" feel */
	animated?: boolean;
	/** Render the soft floating color orbs */
	orbs?: boolean;
};

/**
 * Decorative full-bleed background: an adaptive grid (or dot) pattern that
 * fades toward the edges, plus optional ambient glow orbs. Purely visual —
 * sits behind content and never intercepts pointer events.
 */
export function GridBackground({
	className,
	variant = "grid",
	animated = true,
	orbs = true,
}: GridBackgroundProps) {
	return (
		<div
			aria-hidden
			className={cn(
				"pointer-events-none absolute inset-0 -z-10 overflow-hidden",
				className,
			)}
		>
			{/* Pattern layer */}
			<div
				className={cn(
					"absolute inset-0 mask-radial-fade",
					variant === "dot" ? "bg-dot-pattern" : "bg-grid-pattern",
					animated && "animate-grid-pan",
				)}
			/>

			{/* Ambient glow orbs */}
			{orbs && (
				<>
					<div className="absolute -top-40 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl animate-float-slow" />
					<div className="absolute bottom-[-6rem] right-[12%] h-72 w-72 rounded-full bg-blue-500/10 blur-3xl animate-float-slower" />
					<div className="absolute top-1/3 left-[8%] h-64 w-64 rounded-full bg-violet-500/10 blur-3xl animate-float-slower" />
				</>
			)}
		</div>
	);
}
