"use client";

import { useEffect, useRef, useState } from "react";
import {
	Bold,
	Italic,
	Underline,
	List,
	ListOrdered,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
	value: string;
	onChange: (value: string) => void;
	className?: string;
	placeholder?: string;
	rows?: number;
}

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
}: RichTextEditorProps) {
	const editorRef = useRef<HTMLDivElement>(null);
	const [active, setActive] = useState<ActiveState>(defaultActive);

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

	const minHeight = `${rows * 1.5}rem`;

	return (
		<>
			<div
				className="hidden print:block rich-editor-content text-sm text-slate-900 leading-relaxed"
				dangerouslySetInnerHTML={{ __html: value }}
			/>
			<div
				className={cn(
					"no-print border border-gray-400 rounded-md bg-white overflow-hidden",
					className,
				)}
			>
				<div className="flex items-center gap-1 border-b border-gray-300 bg-gray-50 px-2 py-1">
				<ToolbarButton
					onClick={() => exec("bold")}
					title="Bold"
					active={active.bold}
				>
					<Bold className="h-3.5 w-3.5" />
				</ToolbarButton>
				<ToolbarButton
					onClick={() => exec("italic")}
					title="Italic"
					active={active.italic}
				>
					<Italic className="h-3.5 w-3.5" />
				</ToolbarButton>
				<ToolbarButton
					onClick={() => exec("underline")}
					title="Underline"
					active={active.underline}
				>
					<Underline className="h-3.5 w-3.5" />
				</ToolbarButton>
				<div className="w-px h-5 bg-gray-300 mx-1" />
				<ToolbarButton
					onClick={() => exec("insertUnorderedList")}
					title="Bullet list"
					active={active.insertUnorderedList}
				>
					<List className="h-3.5 w-3.5" />
				</ToolbarButton>
				<ToolbarButton
					onClick={() => exec("insertOrderedList")}
					title="Numbered list"
					active={active.insertOrderedList}
				>
					<ListOrdered className="h-3.5 w-3.5" />
				</ToolbarButton>
			</div>
				<div
					ref={editorRef}
					contentEditable
					onInput={handleInput}
					onKeyUp={updateActive}
					onMouseUp={updateActive}
					onFocus={updateActive}
					data-placeholder={placeholder}
					className="rich-editor-content px-3 py-2 text-sm text-slate-900 leading-relaxed outline-none focus:outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400"
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
}: {
	onClick: () => void;
	title: string;
	children: React.ReactNode;
	active?: boolean;
}) {
	return (
		<button
			type="button"
			onMouseDown={(e) => {
				e.preventDefault();
				onClick();
			}}
			title={title}
			className={cn(
				"p-1.5 rounded transition-colors",
				active
					? "bg-blue-100 text-blue-700 ring-1 ring-blue-300"
					: "text-slate-700 hover:bg-gray-200",
			)}
		>
			{children}
		</button>
	);
}
