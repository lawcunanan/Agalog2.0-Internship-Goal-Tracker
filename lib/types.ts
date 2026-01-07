//User details stored in redux state
export interface UserDetails {
	user_id: string;
	role?: "Student" | "Admin" | "Super Admin";
	email?: string;
	section?: string;
	full_name?: string;
	avatar_url?: string;
	status?: string;
	created_at?: string;
}
