import { cn } from "@/lib/utils";

type GridBackgroundProps = {
	className?: string;
	/** Render the subtle scattered color glow ("sabog na kulay") */
	orbs?: boolean;
};

/**
 * Decorative background: a static dot pattern tucked into the top-right and
 * bottom-left corners (densest in the corner, fading inward), with an optional
 * subtle scatter of colored glows. Purely visual — sits behind content, never
 * animates, never intercepts pointer events.
 */
export function GridBackground({ className, orbs = false }: GridBackgroundProps) {
	return (
		<div
			aria-hidden
			className={cn(
				"pointer-events-none absolute inset-0 -z-10 overflow-hidden",
				className,
			)}
		>
			{/* Scattered color glows (subtle, static) */}
			{orbs && (
				<>
					<div className="absolute -top-24 -right-16 h-80 w-80 rounded-full bg-violet-500/15 blur-3xl" />
					<div className="absolute top-1/4 right-1/4 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />
					<div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />
					<div className="absolute bottom-1/4 left-1/3 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
					<div className="absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />
				</>
			)}

			{/* Corner dot patches */}
			<div className="absolute top-0 right-0 h-128 w-lg bg-dot-pattern mask-corner-tr" />
			<div className="absolute bottom-0 left-0 h-128 w-lg bg-dot-pattern mask-corner-bl" />
		</div>
	);
}
