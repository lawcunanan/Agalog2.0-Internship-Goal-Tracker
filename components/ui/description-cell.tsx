"use client";

import { useMemo, useState } from "react";
import { sanitizeHTML, stripHTMLToText } from "@/lib/utils/html";

interface DescriptionCellProps {
	description: string;
	emptyText?: string;
}

export function DescriptionCell({
	description,
	emptyText = "-",
}: DescriptionCellProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const maxLength = 50;

	const plain = useMemo(() => stripHTMLToText(description), [description]);
	const safeHTML = useMemo(() => sanitizeHTML(description), [description]);

	if (!plain) return <span>{emptyText}</span>;
	if (plain.length <= maxLength) {
		return (
			<span
				className="rich-editor-content"
				dangerouslySetInnerHTML={{ __html: safeHTML }}
			/>
		);
	}

	const truncatedText = `${plain.slice(0, maxLength)}...`;

	return (
		<div>
			{isExpanded ? (
				<span
					className="rich-editor-content"
					dangerouslySetInnerHTML={{ __html: safeHTML }}
				/>
			) : (
				<span>{truncatedText}</span>
			)}
			<button
				onClick={(e) => {
					e.stopPropagation();
					setIsExpanded(!isExpanded);
				}}
				className="ml-1 text-foreground hover:underline focus:outline-none"
			>
				{isExpanded ? "See Less" : "See More"}
			</button>
		</div>
	);
}
