"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { TypewriterText } from "@/components/ui/typewriter-text";
import { GridBackground } from "@/components/ui/grid-background";
import { signInWithGoogle } from "@/services/csr/auth/login";
import { useAlert } from "@/providers/alert-provider";
import { cn } from "@/lib/utils";
import { Clock, TrendingUp, FileText, Sparkles } from "lucide-react";

const FEATURES = [
	{
		icon: Clock,
		title: "Track Your Hours",
		desc: "Log daily tasks and watch your internship hours add up automatically.",
	},
	{
		icon: TrendingUp,
		title: "Instant Progress",
		desc: "See exactly how close you are to your goal with a live progress view.",
	},
	{
		icon: FileText,
		title: "Weekly Reports",
		desc: "Generate clean weekly and daily summaries ready to submit in seconds.",
	},
];

function HomeContent() {
	const searchParams = useSearchParams();
	const userRole = searchParams.get("role");
	const { showAlert } = useAlert();

	return (
		<main className="relative min-h-screen flex flex-col overflow-hidden">
			<GridBackground />
			<Header />

			<div className="flex-1 flex items-center justify-center p-6">
				<div className="max-w-3xl w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 mt-14">
					{/* Badge */}
					<div className="flex justify-center">
						<span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm">
							<Sparkles className="h-3.5 w-3.5 text-violet-400" />
							Agalog — Internship Goal Tracker
						</span>
					</div>

					<div className="h-25 flex items-center justify-center">
						<h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground">
							<TypewriterText
								phrases={[
									"Track Your Hours.",
									"Instant Progress View.",
									"Weekly Summaries Ready.",
								]}
							/>
						</h1>
					</div>

					<p className="text-base sm:text-lg text-muted-foreground max-w-150 mx-auto leading-relaxed">
						A minimal, elegant internship goal tracker designed for interns.
						Track your tasks, monitor your progress, and stay aligned with your
						goals.
					</p>

					<div className="flex items-center justify-center gap-4 pt-2">
						<button
							onClick={() => signInWithGoogle(userRole, showAlert)}
							type="button"
							className={cn(
								"group relative h-12 px-8 min-w-50 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2 justify-center border border-transparent font-medium cursor-pointer overflow-hidden shadow-lg shadow-primary/20",
								userRole?.toLowerCase() === "admin" &&
									"shadow-[0_0_20px_rgba(239,68,68,0.3)] after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:bg-linear-to-r after:from-red-500 after:via-orange-500 after:to-red-500",
							)}
						>
							{/* Shine sweep */}
							<span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 skew-x-12 bg-white/20 animate-shine" />
							<svg className="w-5 h-5" viewBox="0 0 24 24">
								<path
									d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
									fill="#4285F4"
								/>
								<path
									d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
									fill="#34A853"
								/>
								<path
									d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
									fill="#FBBC05"
								/>
								<path
									d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
									fill="#EA4335"
								/>
							</svg>
							Login with Google
						</button>
					</div>

					{/* Feature cards */}
					<div className="grid sm:grid-cols-3 gap-4 pt-8 text-left">
						{FEATURES.map(({ icon: Icon, title, desc }) => (
							<div
								key={title}
								className="group rounded-xl border border-border bg-background/50 p-5 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-foreground/20 hover:bg-background/80 hover:shadow-lg"
							>
								<div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted/50 text-foreground transition-colors group-hover:bg-foreground group-hover:text-background">
									<Icon className="h-5 w-5" />
								</div>
								<h3 className="text-sm font-semibold text-foreground">
									{title}
								</h3>
								<p className="mt-1 text-xs text-muted-foreground leading-relaxed">
									{desc}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>

			<Footer />
		</main>
	);
}

export default function Home() {
	return (
		<Suspense fallback={null}>
			<HomeContent />
		</Suspense>
	);
}
