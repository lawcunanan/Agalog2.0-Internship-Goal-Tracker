"use client";

import * as React from "react";
import { CheckCircle2, AlertTriangle, XCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertType = "success" | "warning" | "danger";

interface Alert {
	id: string;
	type: AlertType;
	message: string;
}

interface AlertContextType {
	showAlert: (status: number, message: string) => void;
}

const AlertContext = React.createContext<AlertContextType | undefined>(
	undefined,
);

export function AlertProvider({ children }: { children: React.ReactNode }) {
	const [alerts, setAlerts] = React.useState<Alert[]>([]);

	const showAlert = React.useCallback((status: number, message: string) => {
		let type: AlertType = "warning";
		if (status >= 200 && status < 300) {
			type = "success";
		} else if (status >= 400 && status < 500) {
			type = "warning";
		} else if (status >= 500) {
			type = "danger";
		}

		const id = Math.random().toString(36).substring(7);
		setAlerts((prev) => [...prev, { id, type, message }]);

		setTimeout(() => {
			setAlerts((prev) => prev.filter((alert) => alert.id !== id));
		}, 5000);
	}, []);

	const removeAlert = (id: string) => {
		setAlerts((prev) => prev.filter((alert) => alert.id !== id));
	};

	return (
		<AlertContext.Provider value={{ showAlert }}>
			{children}
			<div className="fixed top-4 pl-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
				{alerts.map((alert) => (
					<div
						key={alert.id}
						className={cn(
							"pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white max-w-137.5 animate-in slide-in-from-right-full transition-all",
							alert.type === "success" && "bg-green-600",
							alert.type === "warning" && "bg-yellow-600",
							alert.type === "danger" && "bg-red-600",
						)}
					>
						{alert.type === "success" && <CheckCircle2 className="h-5 w-5" />}
						{alert.type === "warning" && <AlertTriangle className="h-5 w-5" />}
						{alert.type === "danger" && <XCircle className="h-5 w-5" />}
						<span className="flex-1 text-sm font-medium">{alert.message}</span>
						<button
							onClick={() => removeAlert(alert.id)}
							className="hover:opacity-80"
						>
							<X className="h-4 w-4" />
						</button>
					</div>
				))}
			</div>
		</AlertContext.Provider>
	);
}

export function useAlert() {
	const context = React.useContext(AlertContext);
	if (context === undefined) {
		throw new Error("useAlert must be used within an AlertProvider");
	}
	return context;
}
