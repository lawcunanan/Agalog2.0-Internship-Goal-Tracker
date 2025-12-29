import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
	let response = NextResponse.next({
		request: {
			headers: request.headers,
		},
	});

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value, options }) =>
						request.cookies.set(name, value),
					);
					response = NextResponse.next({
						request,
					});
					cookiesToSet.forEach(({ name, value, options }) =>
						response.cookies.set(name, value, options),
					);
				},
			},
		},
	);

	const {
		data: { user },
	} = await supabase.auth.getUser();

	const path = request.nextUrl.pathname;

	// Define protected routes and allowed roles
	const routePermissions = [
		{ path: "/logs", roles: ["Student"] },
		{ path: "/admin", roles: ["Admin"] },
		{ path: "/superadmin", roles: ["SuperAdmin", "Admin"] },
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
		// Fetch user role
		const { data: userData, error } = await supabase
			.from("users")
			.select("role")
			.eq("user_id", user.id)
			.single();

		if (error) {
			console.error("Middleware: Error fetching user role:", error);
		}

		const userRole = userData?.role;

		// Redirect logged-in users from landing page based on role
		if (path === "/") {
			if (userRole === "Student") {
				return NextResponse.redirect(new URL("/logs", request.url));
			} else if (userRole === "Admin") {
				return NextResponse.redirect(new URL("/admin", request.url));
			} else if (userRole === "SuperAdmin") {
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
