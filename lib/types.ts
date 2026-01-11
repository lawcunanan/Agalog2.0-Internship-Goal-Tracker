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
	//
	hoursWorked?: string;
	rawHours?: number;
	description: string;
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
