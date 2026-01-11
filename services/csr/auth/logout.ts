import { supabaseBrowser } from "@/lib/supabase/client";

export const signOutUser = async (
	showAlert: (status: number, message: string) => void,
	setIsLoading: (loading: boolean) => void,
) => {
	setIsLoading(true);
	try {
		const { error } = await supabaseBrowser.auth.signOut();

		if (error) {
			throw error;
		}

		showAlert(200, "Signed out successfully");
	} catch (error: any) {
		showAlert(500, "Error signing out");
	} finally {
		setIsLoading(false);
	}
};
