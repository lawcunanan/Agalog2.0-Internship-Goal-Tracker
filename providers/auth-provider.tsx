"use client";

import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import authAnimation from "@/public/lottie/authLoading.json";
import {
	createContext,
	useContext,
	useState,
	useEffect,
	type ReactNode,
} from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { useAlert } from "./alert-provider";
import { UserState } from "@/lib/types";
import { getAuthValues } from "@/services/ssr/auth/get-auth";

interface AuthContextType {
	user: UserState | null;
	isLoading: boolean;
	setUser: (user: UserState | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
	children,
	userDetails,
}: {
	children: ReactNode;
	userDetails: UserState | null;
}) {
	const router = useRouter();
	const [user, setUser] = useState<UserState | null>(userDetails);
	const [isLoading, setIsLoading] = useState(true);
	const { showAlert } = useAlert();

	useEffect(() => {
		const {
			data: { subscription },
		} = supabaseBrowser.auth.onAuthStateChange(async (event, session) => {
			if (event === "TOKEN_REFRESHED") {
				if (session?.user) {
					if (!user || user.user_id !== session.user.id) {
						const { data, error } = await getAuthValues(supabaseBrowser);
						if (error) {
							showAlert(500, error);
							setUser(null);
						} else {
							setUser(data);
							router.refresh();
						}
					}
				}
			} else if (event === "SIGNED_OUT") {
				setUser(null);
				router.refresh();
			}

			isLoading && setIsLoading(false);
		});

		return () => {
			subscription.unsubscribe();
		};
	}, [user, showAlert, router]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-screen w-full bg-background">
				<div className="w-72 h-72">
					<Lottie animationData={authAnimation} loop />
				</div>
			</div>
		);
	}

	return (
		<AuthContext.Provider value={{ user, isLoading, setUser }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("Auth must be used within AuthProvider");
	}
	return context;
}
