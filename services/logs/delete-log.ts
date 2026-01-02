import { supabase } from "@/lib/supabase";

export const deleteLog = async (
	logId: string,
	showAlert: (status: number, message: string) => void,
	setIsLoading: (loading: boolean) => void,
	setOpen: (open: boolean) => void,
) => {
	setIsLoading(true);

	try {
		if (!logId) throw new Error("Log ID is required");

		const { error } = await supabase.from("logs").delete().eq("log_id", logId);

		if (error) throw error;

		showAlert(200, "Log deleted successfully.");
	} catch (error: any) {
		showAlert(500, error.message || "Failed to delete log");
	} finally {
		setIsLoading(false);
		setOpen(false);
	}
};
