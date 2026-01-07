//User details stored in redux state

export type UserRole = "Student" | "Admin" | "Super Admin";

export interface UserDetails {
	user_id: string;
	role?: UserRole;
	email?: string;
	section?: string;
	full_name?: string;
	avatar_url?: string;
	status?: string;
	created_at?: string;
}
