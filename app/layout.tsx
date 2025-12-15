import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { AlertProvider } from "@/providers/alert-provider";
import { AuthProvider } from "@/providers/auth-provider";

const _geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Agalog",
	description:
		"A simple and organized way to log your daily attendance and monitor your internship progress.",
	generator: "Lawrence S. Cunanan - https://lacunanan.vercel.app/",
	icons: {
		icon: [
			{ url: "agalog.png", media: "(prefers-color-scheme: light)" },
			{ url: "agalog.png", media: "(prefers-color-scheme: dark)" },
		],
		apple: "agalog.png",
	},
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`font-sans antialiased ${_geist.className}`}>
				<AlertProvider>
					<AuthProvider>
						<ThemeProvider
							attribute="class"
							defaultTheme="dark"
							enableSystem
							disableTransitionOnChange
						>
							{children}
						</ThemeProvider>
					</AuthProvider>
				</AlertProvider>
			</body>
		</html>
	);
}
