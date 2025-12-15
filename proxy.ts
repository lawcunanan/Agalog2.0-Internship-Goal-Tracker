import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Supabase service role key for server-side requests
const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const roleAccess: { [key: string]: string[] } = {
	"/dashboard": ["Admin"],
	"/logs": ["Student"],
};

export async function proxy(req: NextRequest) {
	const path = req.nextUrl.pathname;

	// Allow Next.js internals and static files
	if (path.startsWith("/_next") || path.includes(".")) {
		return NextResponse.next();
	}

	// Get Supabase access token from cookie
	const token = req.cookies.get("sb-access-token")?.value;

	// If no token, redirect to login page
	if (!token && path !== "/") {
		return NextResponse.redirect(new URL("/", req.url));
	}

	let role = "";
	if (token) {
		// Fetch user from Supabase
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser(token);

		if (error || !user) {
			return NextResponse.redirect(new URL("/", req.url));
		}

		// Optionally fetch role from your users table
		const { data: userDetails, error: userError } = await supabase
			.from("users")
			.select("role")
			.eq("auth_id", user.id)
			.single();

		role = userDetails?.role ?? "";
	}

	// Check route access
	for (const route in roleAccess) {
		if (path.startsWith(route) && !roleAccess[route].includes(role)) {
			return NextResponse.redirect(new URL("/unauthorized", req.url));
		}
	}

	// Redirect logged-in users from "/" to their dashboard
	if (token && path === "/") {
		return NextResponse.redirect(
			new URL(role === "Admin" ? "/dashboard" : "/logs", req.url),
		);
	}

	return NextResponse.next();
}
