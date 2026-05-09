const escape = (text: string) =>
	text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");

const applyInlineMarkdown = (escaped: string) =>
	escaped
		.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
		.replace(/__(.+?)__/g, "<strong>$1</strong>")
		.replace(/(^|[^*])\*([^*\s][^*]*?)\*(?!\*)/g, "$1<em>$2</em>")
		.replace(/(^|[^_])_([^_\s][^_]*?)_(?!_)/g, "$1<em>$2</em>");

export const stripHTMLToText = (html: string): string => {
	if (!html) return "";
	const normalized = html
		.replace(/<\s*br\s*\/?>/gi, "\n")
		.replace(/<\/(p|div|ul|ol)>/gi, "\n")
		.replace(/<li[^>]*>/gi, "- ")
		.replace(/<\/li>/gi, "\n");

	let text: string;
	if (typeof document !== "undefined") {
		const div = document.createElement("div");
		div.innerHTML = normalized;
		text = div.textContent ?? "";
	} else {
		text = normalized.replace(/<[^>]*>/g, "");
	}
	return text
		.replace(/\n{3,}/g, "\n\n")
		.split("\n")
		.map((line) => line.trim())
		.filter(Boolean)
		.join("\n");
};

export const plainTextToHTML = (text: string): string => {
	if (!text) return "";
	const lines = text.replace(/\r\n/g, "\n").split("\n");
	const out: string[] = [];
	let listType: "ul" | "ol" | null = null;
	const closeList = () => {
		if (listType) {
			out.push(`</${listType}>`);
			listType = null;
		}
	};

	const bullet = /^\s*[-*•]\s+(.*)$/;
	const numbered = /^\s*\d+[.)]\s+(.*)$/;

	for (const raw of lines) {
		const line = raw.trim();
		if (!line) {
			closeList();
			continue;
		}
		const bulletMatch = line.match(bullet);
		const numberedMatch = line.match(numbered);

		if (bulletMatch) {
			if (listType !== "ul") {
				closeList();
				out.push("<ul>");
				listType = "ul";
			}
			out.push(`<li>${applyInlineMarkdown(escape(bulletMatch[1]))}</li>`);
		} else if (numberedMatch) {
			if (listType !== "ol") {
				closeList();
				out.push("<ol>");
				listType = "ol";
			}
			out.push(`<li>${applyInlineMarkdown(escape(numberedMatch[1]))}</li>`);
		} else {
			closeList();
			if (out.length > 0 && !out[out.length - 1].endsWith(">")) {
				out.push("<br>");
			}
			out.push(applyInlineMarkdown(escape(line)));
		}
	}
	closeList();
	return out.join("");
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
