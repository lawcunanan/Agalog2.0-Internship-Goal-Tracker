import { supabaseServer } from "@/lib/supabase/server";

export const getUser = async () => {
	const supabase = await supabaseServer();
	try {
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser();

		if (error) {
			return null;
		}

		return user;
	} catch (error) {
		console.error("Unexpected error fetching user:", error);
		return null;
	}
};
