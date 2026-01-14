// lib/types.ts

export type UserRole = "Student" | "Admin" | "Owner" | "Super Admin";
export type Status = "Active" | "Inactive";

export interface UserState {
	user_id: string;
	role?: UserRole;
	email?: string;
	section?: string;
	full_name?: string;
	avatar_url?: string;
	status?: Status;
	created_at?: string;
}

export interface GoalsState {
	goal_id: string;
	user_id?: string;
	status?: Status;
	title: string;
	goal: number;
	pubToken?: string;
	priToken?: string;
	sections?: string[];
	created_by?: string;
	created_at?: string;

	// For creating contributions
	section?: string;
	company?: string;
	metaText?: string;
}

export interface GoalActiveState {
	goal_id: string;
	goalHours: number;
}

//Log details stored in redux state
export interface LogValues {
	log_id: string;
	date: string;
	fullDate?: string | Date;
	timeIn: string;
	timeOut: string;
	breakOut?: string;
	breakBack?: string;
	breakDuration: string;
	description: string;

	//
	hoursWorked?: string;
	rawHours?: number;
}

export interface WeeklyLogState {
	logs: WeeklyLogSelect[];
	currentHours: number;
	editLog?: LogValues | null;
}

export interface WeeklyLogSelect {
	weekLabel: string;
	startDate: string;
	endDate: string;
	previousHours: string;
	thisPeriodHours: string;
	totalHours: string;
	rawTotalHours: number;
	logs: LogValues[];
}

//Admin
export interface UserDataSelect {
	// Common user fields
	user_id?: string;
	picture?: string;
	fullname?: string;
	email?: string;
	role?: string;
	status?: string;
	createdAt?: string;

	// Profile / org
	section?: string;
	company?: string;

	// Logs (TodayLogsSelect)
	date?: string;
	timeIn?: string;
	timeOut?: string;
	breakDuration?: string;
	description?: string;
	hoursWorked?: string;

	// Goals / summary
	goalId?: string;
	goalTitle?: string;
	goalHours?: number;
	createdBy?: string;
	totalHours?: string;
	hoursLeft?: string;
}

export interface StatsticsSelect {
	todayLogs: number;
	completedGoals?: number;
	totalUsers: number;
	totalAdmins: number;
}
