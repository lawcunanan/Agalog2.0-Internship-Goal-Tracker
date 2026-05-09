import { NextResponse } from "next/server";
import { buildPrompt, type AIMode } from "@/lib/ai/prompts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = "gemini-2.5-flash-lite";
const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

type RequestBody = {
	mode: AIMode;
	text?: string;
	entries?: string[];
};

type GeminiPart = { text?: string };
type GeminiCandidate = {
	content?: { parts?: GeminiPart[] };
	finishReason?: string;
};
type GeminiResponse = {
	candidates?: GeminiCandidate[];
	promptFeedback?: { blockReason?: string };
	error?: { message?: string };
};

export async function POST(req: Request) {
	const apiKey = process.env.GEMINI_API_KEY;
	if (!apiKey) {
		return NextResponse.json(
			{ error: "GEMINI_API_KEY is not configured" },
			{ status: 500 },
		);
	}

	let body: RequestBody;
	try {
		body = await req.json();
	} catch {
		return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
	}

	let prompt: string;
	if (body.mode === "improve") {
		const text = body.text?.trim();
		if (!text) {
			return NextResponse.json(
				{ error: "Text is required for improve mode" },
				{ status: 400 },
			);
		}
		prompt = buildPrompt("improve", text);
	} else if (body.mode === "summarize") {
		const entries = (body.entries ?? []).filter((e) => e.trim());
		if (entries.length === 0) {
			return NextResponse.json(
				{ error: "At least one non-empty entry is required" },
				{ status: 400 },
			);
		}
		prompt = buildPrompt("summarize", entries);
	} else {
		return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
	}

	try {
		const url = `${API_BASE}/${MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;
		const upstream = await fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				contents: [{ parts: [{ text: prompt }] }],
				generationConfig: { responseMimeType: "application/json" },
			}),
		});

		const data = (await upstream.json()) as GeminiResponse;

		if (!upstream.ok) {
			const message = data.error?.message ?? `Gemini API error (${upstream.status})`;
			console.error("[/api/ai] upstream error", upstream.status, data);
			return NextResponse.json({ error: message }, { status: 502 });
		}

		const candidate = data.candidates?.[0];
		const raw =
			candidate?.content?.parts
				?.map((p) => p.text ?? "")
				.join("")
				.trim() ?? "";

		if (!raw) {
			const detail =
				data.promptFeedback?.blockReason ??
				candidate?.finishReason ??
				"no candidates";
			console.error("[/api/ai] empty response", data);
			return NextResponse.json(
				{ error: `AI returned no text (${detail})` },
				{ status: 502 },
			);
		}

		let envelope: { valid?: boolean; text?: string; reason?: string };
		try {
			envelope = JSON.parse(raw);
		} catch {
			console.error("[/api/ai] non-JSON output", raw);
			return NextResponse.json(
				{ error: "AI returned malformed output" },
				{ status: 502 },
			);
		}

		if (envelope.valid === false) {
			return NextResponse.json(
				{ error: envelope.reason?.trim() || "Input rejected." },
				{ status: 400 },
			);
		}

		const text = envelope.text?.trim();
		if (!text) {
			return NextResponse.json(
				{ error: "AI returned no text." },
				{ status: 502 },
			);
		}

		return NextResponse.json({ text });
	} catch (err) {
		const message = err instanceof Error ? err.message : "AI request failed";
		console.error("[/api/ai]", err);
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
