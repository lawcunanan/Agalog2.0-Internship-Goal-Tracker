"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { tempInsertLog } from "@/services/logs/temp-insert-log";
import { useAuth } from "@/providers/auth-provider";
import { useAlert } from "@/providers/alert-provider";

export default function DashboardPage() {
	const { user } = useAuth();
	const { showAlert } = useAlert();

	const [goalId, setGoalId] = useState("");
	const [targetUserId, setTargetUserId] = useState("");
	const [rawText, setRawText] = useState("");
	const [loading, setLoading] = useState(false);

	const handleTempInsert = async () => {
		try {
			if (!rawText || !goalId || !targetUserId) {
				showAlert(400, "User ID, Goal ID, and raw data are required");
				return;
			}

			const parsed = JSON.parse(rawText);

			const logs = Array.isArray(parsed) ? parsed : [parsed];

			for (const log of logs) {
				await tempInsertLog(targetUserId, goalId, log, showAlert, setLoading);
			}

			showAlert(200, "Temp insert completed");
		} catch (err: any) {
			console.error(err);
			showAlert(500, "Invalid JSON format");
		}
	};

	return (
		<main className="min-h-screen flex flex-col">
			<Header goalId={goalId} setGoalId={setGoalId} />

			<div className="flex-1 p-4 pt-24 flex flex-col items-center">
				<div className="max-w-3xl w-full space-y-4">
					<h1 className="text-2xl font-bold">Temp Log Inserter</h1>

					<input
						type="text"
						placeholder="Target User ID"
						className="w-full border p-2 rounded"
						value={targetUserId}
						onChange={(e) => setTargetUserId(e.target.value)}
					/>

					<input
						type="text"
						placeholder="Goal ID"
						className="w-full border p-2 rounded"
						value={goalId}
						onChange={(e) => setGoalId(e.target.value)}
					/>

					<textarea
						placeholder="Paste Firestore raw JSON here"
						className="w-full border p-2 rounded min-h-[200px] font-mono text-sm"
						value={rawText}
						onChange={(e) => setRawText(e.target.value)}
					/>

					<button
						onClick={handleTempInsert}
						disabled={loading}
						className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
					>
						{loading ? "Inserting..." : "Temp Insert Logs"}
					</button>
				</div>
			</div>

			<Footer />
		</main>
	);
}
