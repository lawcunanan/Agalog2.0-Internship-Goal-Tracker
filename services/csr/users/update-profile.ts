import { SupabaseClient } from "@supabase/supabase-js";

export const updateProfile = async (
	supabase: SupabaseClient,
	user_id: string,
	name: string,
	current_signature_url: string | null,
	signature_file: File | null,
	signature_url_delete: string | null,
	current_sup_signature_url: string | null,
	sup_signature_file: File | null,
	sup_signature_url_delete: string | null,
	showAlert: (status: number, message: string) => void,
	setIsLoading: (loading: boolean) => void,
) => {
	setIsLoading(true);
	try {
		let signature_url: string | null = null;
		let sup_signature_url: string | null = null;

		// Upload intern signature
		if (signature_file) {
			const fileExt = signature_file.name.split(".").pop();
			const timestamp = Date.now();
			const fileName = `signature-${user_id}-${timestamp}.${fileExt}`;
			const filePath = `${fileName}`;

			const { error: uploadError } = await supabase.storage
				.from("signatures")
				.upload(filePath, signature_file);

			if (uploadError) {
				showAlert(500, "Failed to upload signature. Please try again.");
				console.error("updateProfile upload error:", uploadError.message);
				return;
			}

			const { data } = supabase.storage
				.from("signatures")
				.getPublicUrl(filePath);
			signature_url = data.publicUrl;
		} else {
			signature_url = current_signature_url;
		}

		// Upload supervisor signature
		if (sup_signature_file) {
			const fileExt = sup_signature_file.name.split(".").pop();
			const timestamp = Date.now();
			const fileName = `sup-signature-${user_id}-${timestamp}.${fileExt}`;
			const filePath = `${fileName}`;

			const { error: uploadError } = await supabase.storage
				.from("signatures")
				.upload(filePath, sup_signature_file);

			if (uploadError) {
				showAlert(
					500,
					"Failed to upload supervisor signature. Please try again.",
				);
				console.error("updateProfile sup upload error:", uploadError.message);
				return;
			}

			const { data } = supabase.storage
				.from("signatures")
				.getPublicUrl(filePath);
			sup_signature_url = data.publicUrl;
		} else {
			sup_signature_url = current_sup_signature_url;
		}

		const { error } = await supabase
			.from("users")
			.update({ full_name: name, signature_url, sup_signature_url })
			.eq("user_id", user_id);

		if (error) {
			showAlert(500, "Failed to update profile. Please try again.");
			console.error("updateProfile error:", error.message);
			return;
		}

		// Delete old intern signature
		if (signature_url_delete) {
			const filePath = getFilePathFromUrl(signature_url_delete);
			const { error: deleteError } = await supabase.storage
				.from("signatures")
				.remove([filePath]);

			if (deleteError) {
				console.error("updateProfile delete error:", deleteError.message);
			}
		}

		// Delete old supervisor signature
		if (sup_signature_url_delete) {
			const filePath = getFilePathFromUrl(sup_signature_url_delete);
			const { error: deleteError } = await supabase.storage
				.from("signatures")
				.remove([filePath]);

			if (deleteError) {
				console.error(
					"updateProfile sup delete error:",
					deleteError.message,
				);
			}
		}

		showAlert(200, "Profile updated successfully!");
	} catch (error: any) {
		showAlert(500, "An unexpected error occurred. Please try again.");
		console.error("updateProfile error:", error.message);
	} finally {
		setIsLoading(false);
	}
};

const getFilePathFromUrl = (url: string) => {
	const parts = url.split("/");
	return parts.slice(-1)[0];
};
