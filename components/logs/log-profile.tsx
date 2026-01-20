"use client";

import { FadeIn } from "@/components/ui/fade-in";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserSelect } from "@/lib/types";

export function StudentProfileHeader({
	student,
}: {
	student: UserSelect | null;
}) {
	return (
		<FadeIn className="border-b border-border p-6 flex gap-6 items-start px-0 py-6">
			<Avatar className="h-36 w-36 shrink-0 rounded-lg sm:block hidden border-4 border-border">
				<AvatarImage
					src={student?.avatar_url}
					alt={student?.fullname || "Student"}
				/>
				<AvatarFallback className=" text-2xl font-bold text-muted-foreground rounded-sm bg-card">
					{student?.fullname?.charAt(0) || "S"}
				</AvatarFallback>
			</Avatar>

			<div className="flex-1 space-y-6">
				<div>
					<h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground uppercase">
						{student?.fullname || "Student"}
					</h1>
					<p className="text-muted-foreground text-base">
						{student?.email || "No email provided"}
					</p>
				</div>

				<div className="flex flex-wrap gap-6 sm:gap-12 md:gap-20">
					<div>
						<p className="text-xs text-muted-foreground font-medium uppercase">
							Role
						</p>
						<p className="text-sm text-foreground font-medium">
							{student?.role || "No role assigned"}
						</p>
					</div>
					<div>
						<p className="text-xs text-muted-foreground font-medium uppercase">
							Status
						</p>
						<p className="text-sm text-foreground font-medium">
							{student?.status || "No status assigned"}
						</p>
					</div>
					<div>
						<p className="text-xs text-muted-foreground font-medium uppercase">
							Section
						</p>
						<p className="text-sm text-foreground font-medium">
							{student?.section || "No section assigned"}
						</p>
					</div>
					<div>
						<p className="text-xs text-muted-foreground font-medium uppercase">
							Company
						</p>
						<p className="text-sm text-foreground font-medium">
							{student?.company || "No company assigned"}
						</p>
					</div>
				</div>
			</div>
		</FadeIn>
	);
}
