import { Header } from "@/components/header";

export default function AdminPage() {
	return (
		<div className="min-h-screen bg-background pb-10">
			<Header />
			<main className="pt-24 max-w-300 mx-auto px-4">
				<h1 className="text-2xl font-bold mb-4">Admin Page</h1>
			</main>
		</div>
	);
}
