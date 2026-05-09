import { NextResponse } from "next/server";
import { buildPrompt, type AIMode } from "@/lib/ai/prompts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODELS = [
	"gemini-2.5-flash-lite",
	"gemini-2.5-flash",
	"gemini-2.5-pro",
	"gemini-2.0-flash-lite",
];
const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

type Envelope = { valid?: boolean; text?: string; reason?: string };
type AttemptResult =
	| { kind: "success"; envelope: Envelope }
	| { kind: "rejected"; reason: string }
	| { kind: "retryable"; reason: string };

const ATTEMPT_TIMEOUT_MS = 20_000;

const friendlyError = (reasons: string[]): string => {
	const joined = reasons.join(" ").toLowerCase();
	if (joined.includes("quota") || joined.includes("rate limit") || joined.includes("resource_exhausted")) {
		return "AI is busy right now. Please try again in a few moments.";
	}
	if (joined.includes("timeout")) {
		return "AI took too long to respond. Please try again.";
	}
	if (joined.includes("safety") || joined.includes("blocked")) {
		return "AI couldn't process that input. Try rephrasing.";
	}
	if (joined.includes("malformed") || joined.includes("empty")) {
		return "AI returned an unexpected response. Please try again.";
	}
	if (joined.includes("api key") || joined.includes("unauthorized") || joined.includes("permission")) {
		return "AI service is misconfigured. Please contact support.";
	}
	return "AI is unavailable right now. Please try again later.";
};

function parseEnvelope(raw: string): Envelope | null {
	const stripped = raw
		.replace(/^```(?:json)?\s*/i, "")
		.replace(/```\s*$/i, "")
		.trim();

	const start = stripped.indexOf("{");
	const end = stripped.lastIndexOf("}");
	const candidate = start >= 0 && end > start ? stripped.slice(start, end + 1) : stripped;

	try {
		return JSON.parse(candidate);
	} catch {}

	const repaired = candidate.replace(
		/"((?:\\[\s\S]|[^"\\])*)"/g,
		(_, inner: string) =>
			`"${inner.replace(/\r?\n/g, "\\n").replace(/\t/g, "\\t")}"`,
	);
	try {
		return JSON.parse(repaired);
	} catch {
		return null;
	}
}

async function callModel(
	model: string,
	apiKey: string,
	prompt: string,
): Promise<AttemptResult> {
	const url = `${API_BASE}/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), ATTEMPT_TIMEOUT_MS);

	let upstream: Response;
	try {
		upstream = await fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			signal: controller.signal,
			body: JSON.stringify({
				contents: [{ parts: [{ text: prompt }] }],
				generationConfig: {
					responseMimeType: "application/json",
					temperature: 0.4,
					maxOutputTokens: 768,
					thinkingConfig: { thinkingBudget: 256 },
				},
			}),
		});
	} catch (err) {
		clearTimeout(timer);
		if (err instanceof Error && err.name === "AbortError") {
			return { kind: "retryable", reason: "timeout" };
		}
		throw err;
	}
	clearTimeout(timer);

	const data = (await upstream.json()) as GeminiResponse;

	if (!upstream.ok) {
		return {
			kind: "retryable",
			reason: data.error?.message ?? `HTTP ${upstream.status}`,
		};
	}

	const candidate = data.candidates?.[0];
	const raw =
		candidate?.content?.parts
			?.filter((p) => !p.thought)
			.map((p) => p.text ?? "")
			.join("")
			.trim() ?? "";

	if (!raw) {
		return {
			kind: "retryable",
			reason:
				data.promptFeedback?.blockReason ??
				candidate?.finishReason ??
				"empty response",
		};
	}

	const envelope = parseEnvelope(raw);
	if (!envelope) {
		console.warn("[/api/ai] malformed output", raw.slice(0, 300));
		return { kind: "retryable", reason: "malformed JSON output" };
	}

	if (envelope.valid === false) {
		return {
			kind: "rejected",
			reason: envelope.reason?.trim() || "Input rejected.",
		};
	}

	if (!envelope.text?.trim()) {
		return { kind: "retryable", reason: "envelope missing text" };
	}

	return { kind: "success", envelope };
}

type RequestBody = {
	mode: AIMode;
	text?: string;
	entries?: string[];
};

type GeminiPart = { text?: string; thought?: boolean };
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

	const failures: string[] = [];
	for (const model of MODELS) {
		try {
			const result = await callModel(model, apiKey, prompt);

			if (result.kind === "success") {
				return NextResponse.json({
					text: result.envelope.text!.trim(),
					model,
				});
			}

			if (result.kind === "rejected") {
				return NextResponse.json({ error: result.reason }, { status: 400 });
			}

			failures.push(`${model}: ${result.reason}`);
			console.warn(`[/api/ai] ${model} failed:`, result.reason);
		} catch (err) {
			const message = err instanceof Error ? err.message : "request failed";
			failures.push(`${model}: ${message}`);
			console.warn(`[/api/ai] ${model} threw:`, err);
		}
	}

	console.error("[/api/ai] all models failed:", failures.join(" | "));
	return NextResponse.json(
		{ error: friendlyError(failures) },
		{ status: 502 },
	);
}
