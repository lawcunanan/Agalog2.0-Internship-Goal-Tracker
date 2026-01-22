import { type NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { UserRole } from "@/lib/types";
import { getUserRole } from "@/services/ssr/auth/get-role";
import { updateUserRoleMetadata } from "@/services/ssr/auth/update-role-metadata";

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

	const { role: existingRole } = await getUserRole(supabase, user.id);

	let finalRole: UserRole = role;

	if (existingRole) {
		finalRole = existingRole as UserRole;
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
		const { success, error: updateError } = await updateUserRoleMetadata(
			supabase,
			finalRole,
		);

		if (!success) {
			console.error("Error updating user role:", updateError);
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
