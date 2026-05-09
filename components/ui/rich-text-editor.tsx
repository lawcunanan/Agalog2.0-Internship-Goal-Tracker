"use client";

import { useEffect, useRef, useState } from "react";
import {
	Bold,
	Italic,
	Underline,
	List,
	ListOrdered,
	Sparkles,
	Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { plainTextToHTML, stripHTMLToText } from "@/lib/utils/html";

export type AIConfig =
	| { mode: "improve" }
	| { mode: "summarize"; getEntries: () => string[] };

interface RichTextEditorProps {
	value: string;
	onChange: (value: string) => void;
	className?: string;
	placeholder?: string;
	rows?: number;
	ai?: AIConfig;
	onAIError?: (message: string) => void;
	forceLight?: boolean;
}

const lightStyles = {
	container: "border-gray-300 bg-white",
	toolbar: "border-gray-300 bg-gray-50",
	separator: "bg-gray-300",
	editable:
		"text-slate-900 empty:before:text-slate-400",
	button: {
		idle: "text-slate-700 hover:bg-gray-200",
		active: "bg-blue-100 text-blue-700 ring-1 ring-blue-300",
	},
	ai: "text-violet-600 hover:bg-violet-100",
};

const themeStyles = {
	container: "border-border bg-background",
	toolbar: "border-border bg-muted/50",
	separator: "bg-border",
	editable: "text-foreground empty:before:text-muted-foreground",
	button: {
		idle: "text-foreground hover:bg-muted",
		active:
			"bg-blue-100 text-blue-700 ring-1 ring-blue-300 dark:bg-blue-950/40 dark:text-blue-300 dark:ring-blue-800",
	},
	ai: "text-violet-600 hover:bg-violet-100 dark:text-violet-400 dark:hover:bg-violet-950/40",
};

type ActiveState = {
	bold: boolean;
	italic: boolean;
	underline: boolean;
	insertUnorderedList: boolean;
	insertOrderedList: boolean;
};

const defaultActive: ActiveState = {
	bold: false,
	italic: false,
	underline: false,
	insertUnorderedList: false,
	insertOrderedList: false,
};

export function RichTextEditor({
	value,
	onChange,
	className,
	placeholder,
	rows = 5,
	ai,
	onAIError,
	forceLight = false,
}: RichTextEditorProps) {
	const styles = forceLight ? lightStyles : themeStyles;
	const editorRef = useRef<HTMLDivElement>(null);
	const [active, setActive] = useState<ActiveState>(defaultActive);
	const [aiLoading, setAiLoading] = useState(false);

	useEffect(() => {
		if (editorRef.current && editorRef.current.innerHTML !== value) {
			editorRef.current.innerHTML = value;
		}
	}, [value]);

	const updateActive = () => {
		if (
			typeof document === "undefined" ||
			!editorRef.current ||
			!editorRef.current.contains(document.getSelection()?.anchorNode ?? null)
		) {
			return;
		}
		const next: ActiveState = {
			bold: document.queryCommandState("bold"),
			italic: document.queryCommandState("italic"),
			underline: document.queryCommandState("underline"),
			insertUnorderedList: document.queryCommandState("insertUnorderedList"),
			insertOrderedList: document.queryCommandState("insertOrderedList"),
		};
		setActive((prev) =>
			prev.bold === next.bold &&
			prev.italic === next.italic &&
			prev.underline === next.underline &&
			prev.insertUnorderedList === next.insertUnorderedList &&
			prev.insertOrderedList === next.insertOrderedList
				? prev
				: next,
		);
	};

	useEffect(() => {
		document.addEventListener("selectionchange", updateActive);
		return () => document.removeEventListener("selectionchange", updateActive);
	}, []);

	const emitChange = () => {
		if (!editorRef.current) return;
		const html = editorRef.current.innerHTML;
		onChange(html === "<br>" ? "" : html);
	};

	const exec = (command: keyof ActiveState) => {
		document.execCommand(command, false);
		emitChange();
		editorRef.current?.focus();
		updateActive();
	};

	const handleInput = () => {
		emitChange();
		updateActive();
	};

	const setEditorHTML = (html: string) => {
		if (editorRef.current) editorRef.current.innerHTML = html;
		onChange(html);
	};

	const reportError = (message: string) => {
		if (onAIError) onAIError(message);
		else console.error("[AI]", message);
	};

	const handleAI = async () => {
		if (!ai || aiLoading) return;

		const body =
			ai.mode === "improve"
				? { mode: "improve", text: stripHTMLToText(value) }
				: { mode: "summarize", entries: ai.getEntries().filter((e) => e.trim()) };

		if (ai.mode === "improve" && !body.text) {
			reportError("Write something first to improve.");
			return;
		}
		if (ai.mode === "summarize" && (!body.entries || body.entries.length === 0)) {
			reportError("No descriptions found in this week to summarize.");
			return;
		}

		setAiLoading(true);
		try {
			const res = await fetch("/api/ai", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			const raw = await res.text();
			let data: { text?: string; error?: string } = {};
			try {
				data = raw ? JSON.parse(raw) : {};
			} catch {
				const snippet = raw.slice(0, 200).trim();
				throw new Error(
					res.ok
						? `Server returned non-JSON: ${snippet || "empty body"}`
						: `AI request failed (${res.status}): ${snippet || res.statusText}`,
				);
			}
			if (!res.ok) throw new Error(data.error || "AI request failed");
			if (typeof data.text === "string" && data.text.trim()) {
				setEditorHTML(plainTextToHTML(data.text.trim()));
			} else {
				throw new Error("AI returned no text.");
			}
		} catch (err) {
			reportError(err instanceof Error ? err.message : "AI request failed");
		} finally {
			setAiLoading(false);
		}
	};

	const minHeight = `${rows * 1.5}rem`;

	return (
		<>
			<div
				className="hidden print:block rich-editor-content text-sm text-slate-900 leading-relaxed"
				dangerouslySetInnerHTML={{ __html: value }}
			/>
			<div
				className={cn(
					"no-print border rounded-md overflow-hidden",
					styles.container,
					className,
				)}
			>
				<div
					className={cn(
						"flex items-center gap-1 border-b px-2 py-1",
						styles.toolbar,
					)}
				>
					<ToolbarButton
						onClick={() => exec("bold")}
						title="Bold"
						active={active.bold}
						styles={styles.button}
					>
						<Bold className="h-3.5 w-3.5" />
					</ToolbarButton>
					<ToolbarButton
						onClick={() => exec("italic")}
						title="Italic"
						active={active.italic}
						styles={styles.button}
					>
						<Italic className="h-3.5 w-3.5" />
					</ToolbarButton>
					<ToolbarButton
						onClick={() => exec("underline")}
						title="Underline"
						active={active.underline}
						styles={styles.button}
					>
						<Underline className="h-3.5 w-3.5" />
					</ToolbarButton>
					<div className={cn("w-px h-5 mx-1", styles.separator)} />
					<ToolbarButton
						onClick={() => exec("insertUnorderedList")}
						title="Bullet list"
						active={active.insertUnorderedList}
						styles={styles.button}
					>
						<List className="h-3.5 w-3.5" />
					</ToolbarButton>
					<ToolbarButton
						onClick={() => exec("insertOrderedList")}
						title="Numbered list"
						active={active.insertOrderedList}
						styles={styles.button}
					>
						<ListOrdered className="h-3.5 w-3.5" />
					</ToolbarButton>
					{ai && (
						<ToolbarButton
							onClick={handleAI}
							disabled={aiLoading}
							title={
								ai.mode === "improve"
									? "Improve with AI"
									: "Summarize this week's entries"
							}
							className={cn("ml-auto group", styles.ai)}
						>
							{aiLoading ? (
								<Loader2 className="h-3.5 w-3.5 animate-spin" />
							) : (
								<Sparkles className="h-3.5 w-3.5 ai-sparkle group-hover:animate-spin" />
							)}
						</ToolbarButton>
					)}
				</div>
				<div
					ref={editorRef}
					contentEditable
					onInput={handleInput}
					onKeyUp={updateActive}
					onMouseUp={updateActive}
					onFocus={updateActive}
					data-placeholder={placeholder}
					className={cn(
						"rich-editor-content px-3 py-2 text-sm leading-relaxed outline-none focus:outline-none empty:before:content-[attr(data-placeholder)]",
						styles.editable,
					)}
					style={{ minHeight }}
					suppressContentEditableWarning
				/>
			</div>
		</>
	);
}

function ToolbarButton({
	onClick,
	title,
	children,
	active,
	disabled,
	className,
	styles,
}: {
	onClick: () => void;
	title: string;
	children: React.ReactNode;
	active?: boolean;
	disabled?: boolean;
	className?: string;
	styles?: { idle: string; active: string };
}) {
	const buttonStyles = styles ?? themeStyles.button;
	return (
		<button
			type="button"
			disabled={disabled}
			onMouseDown={(e) => {
				e.preventDefault();
				if (!disabled) onClick();
			}}
			title={title}
			className={cn(
				"p-1.5 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
				active ? buttonStyles.active : buttonStyles.idle,
				className,
			)}
		>
			{children}
		</button>
	);
}
