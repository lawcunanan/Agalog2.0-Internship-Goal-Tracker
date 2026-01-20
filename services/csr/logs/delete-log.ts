import { supabaseBrowser } from "@/lib/supabase/client";

export const updateStatus = async (
	log_id: string,
	showAlert: (status: number, message: string) => void,
	setIsLoading: (loading: boolean) => void,
	setOpen: (open: boolean) => void,
) => {
	setIsLoading(true);

	try {
		if (!log_id) throw new Error("Log ID is required");

		const { error } = await supabaseBrowser
			.from("logs")
			.delete()
			.eq("log_id", log_id);

		if (error) throw error;

		showAlert(200, "Log deleted successfully.");
	} catch (error: any) {
		showAlert(500, error.message || "Failed to delete log");
	} finally {
		setIsLoading(false);
		setOpen(false);
	}
};
