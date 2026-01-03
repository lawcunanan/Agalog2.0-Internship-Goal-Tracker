"use client";

import { FadeIn } from "@/components/ui/fade-in";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StudentProfileSelect } from "@/lib/types";

export function StudentProfileHeader({
	student,
}: {
	student: StudentProfileSelect;
}) {
	return (
		<FadeIn className="border-b border-border p-6 flex gap-6 items-start px-0 py-6">
			<Avatar className="h-32 w-32 shrink-0 rounded-lg sm:block hidden border-4 border-border">
				<AvatarImage src={student.picture} alt={student.name} />
				<AvatarFallback className=" text-2xl font-bold text-muted-foreground rounded-sm bg-card">
					{student.name.charAt(0) || "S"}
				</AvatarFallback>
			</Avatar>

			<div className="flex-1 space-y-3">
				<div>
					<h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
						{student.name || "Student"}
					</h1>
					<p className="text-muted-foreground text-base">
						{student.email || "No email provided"}
					</p>
				</div>

				<div className="grid grid-cols-2 pt-2 gap-0 ">
					<div>
						<p className="text-xs text-muted-foreground font-medium uppercase">
							Section
						</p>
						<p className="text-sm text-foreground font-medium">
							{student.section || "No section assigned"}
						</p>
					</div>
					<div>
						<p className="text-xs text-muted-foreground font-medium uppercase">
							Company
						</p>
						<p className="text-sm text-foreground font-medium">
							{student.company || "No company assigned"}
						</p>
					</div>
				</div>
			</div>
		</FadeIn>
	);
}
