import { type NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { UserRole } from "@/lib/types";

export async function GET(request: NextRequest) {
	const { searchParams, origin } = new URL(request.url);
	const code = searchParams.get("code");
	const role = (searchParams.get("role") as UserRole) ?? "Student";
	const next = searchParams.get("next") ?? "/";

	if (!code) {
		return NextResponse.redirect(`${origin}/unauthorized`);
	}

	const supabase = await supabaseServer();

	const { data: sessionData, error: sessionError } =
		await supabase.auth.exchangeCodeForSession(code);

	if (sessionError || !sessionData.session) {
		return NextResponse.redirect(`${origin}/unauthorized`);
	}

	const user = sessionData.session.user;

	const { data: existingUser } = await supabase
		.from("users")
		.select("role")
		.eq("user_id", user.id)
		.single();

	let finalRole: UserRole = role;

	if (existingUser) {
		finalRole = existingUser.role as UserRole;
	} else {
		const { error: insertError } = await supabase.from("users").insert({
			user_id: user.id,
			email: user.email,
			full_name: user.user_metadata.full_name ?? "",
			avatar_url: user.user_metadata.avatar_url ?? "",
			role: role,
			status: "Active",
		});

		if (insertError) {
			console.error("Error creating user:", insertError);
		}
		finalRole = role;
	}

	if (user.user_metadata.role !== finalRole) {
		const { error: updateError } = await supabase.auth.updateUser({
			data: { role: finalRole },
		});

		if (updateError) {
			console.error("Error updating user role:", updateError);
		}

		const { error: refreshError } = await supabase.auth.refreshSession();

		if (refreshError) {
			console.error("Error refreshing session:", refreshError);
		}
	}

	let redirectPath = next;
	if (redirectPath === "/") {
		if (finalRole === "Admin") redirectPath = "/admin";
		else if (finalRole === "Super Admin") redirectPath = "/superadmin";
		else redirectPath = "/student";
	}

	return NextResponse.redirect(`${origin}${redirectPath}`);
}
