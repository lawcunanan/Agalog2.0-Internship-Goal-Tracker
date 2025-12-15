"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
	const pathname = usePathname();
	const isAttendance = pathname === "/logs";

	return (
		<footer className="w-full py-8  mt-8">
			<div className={isAttendance ? "text-left" : "text-center"}>
				<p className="text-sm text-muted-foreground ">
					© 2025 Agalog: Internship Goal Tracker
				</p>
				<p className="text-xs text-muted-foreground/60">
					Developer:{" "}
					<Link
						href="https://lacunanan.vercel.app/"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-primary transition-colors"
					>
						Lawrence S. Cunanan
					</Link>
				</p>
			</div>
		</footer>
	);
}
