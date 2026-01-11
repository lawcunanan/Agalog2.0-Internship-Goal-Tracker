import { Header } from "@/components/header";

export default function AdminPage() {
	return (
		<div className="min-h-screen flex flex-col relative md:overflow-hidden">
			<Header />
			<main className="flex-1 w-full max-w-300 mx-auto px-6 ">
				<h1 className="text-2xl font-bold mb-4">Admin Page</h1>
			</main>
		</div>
	);
}
