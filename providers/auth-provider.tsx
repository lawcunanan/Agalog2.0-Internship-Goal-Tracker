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
import { UserDetails } from "@/lib/types";
import { getAuthValues } from "@/services/auth/get-user";

interface AuthContextType {
	user: UserDetails | null;
	loading: boolean;
	setUser: (user: UserDetails | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
	children,
	userDetails,
}: {
	children: ReactNode;
	userDetails: UserDetails | null;
}) {
	const router = useRouter();
	const [user, setUser] = useState<UserDetails | null>(userDetails);
	const [loading, setLoading] = useState(false);
	const { showAlert } = useAlert();

	useEffect(() => {
		const {
			data: { subscription },
		} = supabaseBrowser.auth.onAuthStateChange(async (event, session) => {
			if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
				if (session?.user) {
					if (!user || user.user_id !== session.user.id) {
						setLoading(true);
						const { data, error } = await getAuthValues(supabaseBrowser);
						if (error) {
							showAlert(500, error);
							setUser(null);
						} else {
							setUser(data);
							router.refresh();
						}

						setLoading(false);
					}
				}
			} else if (event === "SIGNED_OUT") {
				setUser(null);
				setLoading(false);
				router.push("/");
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	}, [user, showAlert]);

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen w-full bg-background">
				<div className="w-72 h-72">
					<Lottie animationData={authAnimation} loop />
				</div>
			</div>
		);
	}

	return (
		<AuthContext.Provider value={{ user, loading, setUser }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within AuthProvider");
	}
	return context;
}
