import { supabase } from "@/lib/supabase";

export const signInWithGoogle = async (
	showAlert: (status: number, message: string) => void,
) => {
	try {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: `${window.location.origin}/auth/callback`,
			},
		});

		if (error) {
			throw error;
		}

		showAlert(200, "Redirecting to Google login…");
		return data;
	} catch (error: any) {
		console.error("Error signing in with Google", error);
		showAlert(500, "Error signing in with Google");
		throw error;
	}
};
