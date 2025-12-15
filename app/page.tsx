"use client";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function Home() {
	return (
		<main className="min-h-screen flex flex-col">
			<Header />
			<Footer />
		</main>
	);
}
