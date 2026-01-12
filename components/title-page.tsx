"use client";

type TitlePageProps = {
	title: string;
	description: string;
};

export function TitlePage({ title, description }: TitlePageProps) {
	return (
		<div>
			<h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
				{title}
			</h1>
			<p className="text-muted-foreground text-base">{description}</p>
		</div>
	);
}
