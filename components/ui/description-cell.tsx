"use client";

import { useState } from "react";

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

	if (!description) return <span>{emptyText}</span>;
	if (description.length <= maxLength) return <span>{description}</span>;

	return (
		<div>
			<span>
				{isExpanded ? description : `${description.slice(0, maxLength)}...`}
			</span>
			<button
				onClick={(e) => {
					e.stopPropagation();
					setIsExpanded(!isExpanded);
				}}
				className="ml-1 text-blue-700 font-medium hover:underline focus:outline-none"
			>
				{isExpanded ? "See Less" : "See More"}
			</button>
		</div>
	);
}
