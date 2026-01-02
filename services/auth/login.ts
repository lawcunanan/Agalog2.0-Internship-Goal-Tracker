import { supabase } from "@/lib/supabase";

export const signInWithGoogle = async (
	role: string | null,
	showAlert: (status: number, message: string) => void,
) => {
	try {
		let userRole = "Student";

		if (role?.toLowerCase() === "admin") {
			userRole = "Admin";
		}

		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: `${window.location.origin}/auth/callback?role=${userRole}`,
			},
		});

		if (error) {
			throw error;
		}

		showAlert(200, "Redirecting to Google login…");
		return data;
	} catch (error: any) {
		showAlert(500, "Error signing in with Google");
		throw error;
	}
};
