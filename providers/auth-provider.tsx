"use client";

import Lottie from "lottie-react";
import authAnimation from "@/public/lottie/authLoading.json";
import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { useAlert } from "@/providers/alert-provider";

export interface UserDetails {
	id: string;
	auth_id: string;
	role?: "Student" | "Admin";
	email?: string;
	full_name?: string;
	avatar_url?: string;
	status?: string;
	created_at?: string;
}

interface AuthContextType {
	user: SupabaseUser | null;
	userDetails: UserDetails | null;
	loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const { showAlert } = useAlert();

	const [user, setUser] = useState<SupabaseUser | null>(null);
	const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let mounted = true;

		const fetchUserDetails = async (authId: string) => {
			const { data, error } = await supabase
				.from("users")
				.select("*")
				.eq("auth_id", authId)
				.maybeSingle();

			if (error) {
				console.error("Supabase fetch error:", error.message);
				showAlert(500, "Error fetching user details");
				return;
			}

			if (mounted) {
				setUserDetails(data);
			}
		};

		// Initial session check
		supabase.auth.getSession().then(({ data }) => {
			const sessionUser = data.session?.user ?? null;
			setUser(sessionUser);

			if (sessionUser) {
				fetchUserDetails(sessionUser.id);
			}

			setLoading(false);
		});

		// Listen to auth changes
		const { data: authListener } = supabase.auth.onAuthStateChange(
			(_event, session) => {
				const sessionUser = session?.user ?? null;
				setUser(sessionUser);

				if (sessionUser) {
					fetchUserDetails(sessionUser.id);
				} else {
					setUserDetails(null);
				}

				setLoading(false);
			},
		);

		return () => {
			mounted = false;
			authListener.subscription.unsubscribe();
		};
	}, [showAlert]);

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
		<AuthContext.Provider value={{ user, userDetails, loading }}>
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
