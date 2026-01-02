import { supabase } from "@/lib/supabase";
import { StudentProfileSelect } from "@/lib/types";

export const getProfile = async (
	studentId: string,
	setStudent: React.Dispatch<React.SetStateAction<StudentProfileSelect | null>>,
	showAlert: (status: number, message: string) => void,
) => {
	try {
		const { data, error } = await supabase
			.from("users")
			.select("user_id, full_name, email, avatar_url")
			.eq("user_id", studentId)
			.single();

		if (error) throw error;
		setStudent({
			user_id: data.user_id,
			name: data.full_name,
			email: data.email,
			picture: data.avatar_url,
		});
	} catch (error: any) {
		showAlert(500, error.message || "Failed to fetch student profile");
	}
};
