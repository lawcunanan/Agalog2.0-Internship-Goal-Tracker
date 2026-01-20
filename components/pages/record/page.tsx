"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useAlert } from "@/providers/alert-provider";
import { TitlePage } from "@/components/title-page";

export function RecordContent() {
	const { showAlert } = useAlert();

	return (
		<div className="min-h-screen flex flex-col relative md:overflow-hidden">
			<Header />
			<main className="flex-1 w-full max-w-300 mx-auto p-6 pt-28 space-y-9">
				<TitlePage
					title="Record Dashboard"
					description=" Overview of all records and platform statistics."
				/>

				<Footer />
			</main>
		</div>
	);
}
