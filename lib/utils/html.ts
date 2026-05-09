const escape = (text: string) =>
	text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");

export const stripHTMLToText = (html: string): string => {
	if (!html) return "";
	if (typeof document !== "undefined") {
		const div = document.createElement("div");
		div.innerHTML = html;
		return (div.textContent ?? "").trim();
	}
	return html.replace(/<[^>]*>/g, "").trim();
};

export const plainTextToHTML = (text: string): string => {
	if (!text) return "";
	const lines = text.replace(/\r\n/g, "\n").split(/\n+/);
	return lines.map((line) => escape(line)).join("<br>");
};

const ALLOWED_TAGS = new Set([
	"b",
	"strong",
	"i",
	"em",
	"u",
	"ul",
	"ol",
	"li",
	"br",
	"p",
	"div",
	"span",
]);

export const sanitizeHTML = (html: string): string => {
	if (!html) return "";
	let out = html
		.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
		.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
		.replace(/\son\w+\s*=\s*"[^"]*"/gi, "")
		.replace(/\son\w+\s*=\s*'[^']*'/gi, "")
		.replace(/javascript:/gi, "");

	out = out.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g, (match, tag) => {
		return ALLOWED_TAGS.has(String(tag).toLowerCase()) ? match : "";
	});
	return out;
};
