"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationControlsProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export function PaginationControls({
	currentPage,
	totalPages,
	onPageChange,
}: PaginationControlsProps) {
	return (
		<div className="flex items-center justify-between">
			<p className="text-sm text-gray-600">
				Page {currentPage} of {totalPages}
			</p>
			<div className="flex gap-2">
				<Button
					variant="outline"
					size="sm"
					onClick={() => onPageChange(Math.max(1, currentPage - 1))}
					disabled={currentPage === 1}
				>
					<ChevronLeft className="w-4 h-4" />
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
					disabled={currentPage === totalPages}
				>
					<ChevronRight className="w-4 h-4" />
				</Button>
			</div>
		</div>
	);
}
