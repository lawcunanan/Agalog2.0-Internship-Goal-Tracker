import { createMiddlewareClient } from "@/lib/supabase/middleware";
import { getUser } from "@/services/ssr/auth/get-user";
import { NextResponse, type NextRequest } from "next/server";
import { UserRole } from "./lib/types";

export async function proxy(request: NextRequest) {
	const { supabase, response } = createMiddlewareClient(request);

	// Handle OAuth redirect falling back to root
	if (
		request.nextUrl.pathname === "/" &&
		request.nextUrl.searchParams.has("code")
	) {
		const callbackUrl = request.nextUrl.clone();
		callbackUrl.pathname = "/auth/callback";
		return NextResponse.redirect(callbackUrl);
	}

	const user = await getUser();
	const path = request.nextUrl.pathname;

	// Define protected routes and allowed roles
	const routePermissions = [
		{ path: "/student", roles: ["Student"] },
		{ path: "/logs", roles: ["Student"] },
		{ path: "/admin", roles: ["Admin"] },
		{ path: "/superadmin", roles: ["Super Admin"] },
		{ path: "/record/", roles: ["Super Admin", "Admin"] },
	];

	// Public routes that don't require authentication
	const isPublicRoute =
		path === "/" ||
		path.startsWith("/auth") ||
		path.startsWith("/unauthorized") ||
		path.startsWith("/images") ||
		path.startsWith("/lottie");

	// If user is not logged in and tries to access a protected route
	if (!user && !isPublicRoute) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	// If user is logged in
	if (user) {
		let userRole: UserRole | null =
			(user.user_metadata.role as UserRole) ?? null;

		// Redirect logged-in users from landing page based on role
		if (path === "/") {
			if (userRole === "Student") {
				return NextResponse.redirect(new URL("/student", request.url));
			} else if (userRole === "Admin") {
				return NextResponse.redirect(new URL("/admin", request.url));
			} else if (userRole === "Super Admin") {
				return NextResponse.redirect(new URL("/superadmin", request.url));
			} else {
				return NextResponse.redirect(new URL("/unauthorized", request.url));
			}
		}

		// Check access for protected routes
		const matchedRoute = routePermissions.find((route) =>
			path.startsWith(route.path),
		);

		if (matchedRoute) {
			if (!userRole || !matchedRoute.roles.includes(userRole)) {
				return NextResponse.redirect(new URL("/unauthorized", request.url));
			}
		}
	}

	return response;
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
