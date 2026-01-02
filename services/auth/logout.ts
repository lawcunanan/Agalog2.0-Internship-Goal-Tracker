import { supabase } from "@/lib/supabase";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const signOutUser = async (
	showAlert: (status: number, message: string) => void,
	router: AppRouterInstance,
	setIsLoading: (loading: boolean) => void,
) => {
	setIsLoading(true);
	try {
		const { error } = await supabase.auth.signOut();

		if (error) {
			throw error;
		}

		showAlert(200, "Signed out successfully");
		router.refresh();
		router.push("/");
	} catch (error: any) {
		showAlert(500, "Error signing out");
	} finally {
		setIsLoading(false);
	}
};
