"use client"; // required for client-side hooks

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
	const handleGoogleLogin = async () => {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: "google",
		});

		if (error) {
			console.error("Login error:", error.message);
			alert(`Login error: ${error.message}`);
		} else {
			console.log("Redirecting to Google login...", data);
			alert("Redirecting to Google login...");
		}
	};

	useEffect(() => {
		const checkUser = async () => {
			const {
				data: { session },
				error,
			} = await supabase.auth.getSession();
			if (error) {
				console.error(error.message);
			} else if (session?.user) {
				// user is logged in
				const user = session.user;
				alert(`Welcome ${user.user_metadata.full_name || user.email}!`);
			}
		};

		checkUser();
	}, []);

	return (
		<div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
			<main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
				<button
					onClick={handleGoogleLogin}
					className="rounded-full bg-blue-600 px-6 py-3 font-mono text-white hover:bg-blue-700"
				>
					Login with Google
				</button>
			</main>
		</div>
	);
}
