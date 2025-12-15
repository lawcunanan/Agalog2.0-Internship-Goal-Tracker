"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { TypewriterText } from "@/components/ui/typewriter-text";
import { signInWithGoogle } from "@/services/auth/login";
import { useAlert } from "@/providers/alert-provider";

export default function Home() {
	const { showAlert } = useAlert();
	return (
		<main className="min-h-screen flex flex-col">
			<Header />

			<div className="flex-1 flex items-center justify-center p-4">
				<div className="max-w-200 w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
					<h2 className="text-xs sm:text-sm font-medium tracking-[0.2em] text-muted-foreground uppercase">
						Agalog: Internship Goal Tracker
					</h2>

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

					<p className="text-lg text-muted-foreground max-w-150 mx-auto leading-relaxed">
						A minimal, elegant internship goal tracker designed for interns.
						Track your tasks, monitor your progress, and stay aligned with your
						goals.
					</p>

					<div className="flex items-center justify-center gap-4 pt-4">
						<button
							onClick={() => signInWithGoogle(showAlert)}
							type="button"
							className="h-12 px-8 min-w-50 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2 justify-center border border-transparent font-medium cursor-pointer"
						>
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
				</div>
			</div>

			<Footer />
		</main>
	);
}
