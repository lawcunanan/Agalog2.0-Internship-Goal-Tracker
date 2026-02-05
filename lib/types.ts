// lib/types.ts
export type UserRole = "Student" | "Admin" | "Owner" | "Super Admin";
export type Status = "Active" | "Inactive";

// [USER TABLE TYPES]
export interface UserSelect {
	user_id: string;
	role: UserRole;
	avatar_url: string;
	fullname: string;
	status: Status;
	email: string;
	signature_url: string;
	createdAt: string;

	section?: string;
	company?: string;
}

export interface GoalAdminSelect {
	user_id: string;
	goalId: number;
	fullname: string;
	email: string;
	avatar_url: string;
	role: UserRole;
	status: Status;
	createdAt: string;
}

export interface UserSummarySelect {
	user_id: string;
	avatar_url: string;
	fullname: string;
	section: string;
	company: string;
	goalTitle: string;
	goalHours: number;
	totalHours: string;
	hoursLeft: string;
}

// [GOAL TABLE TYPES]
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
	createdAt?: string;

	// For creating contributions
	section?: string;
	company?: string;
	metaText?: string;
}

export interface GoalActiveState {
	goal_id: string;
	goalHours: number;
	company?: string;
}

export interface RegisteredGoalSelect {
	goal_id: string;
	goalTitle: string;
	goalHours: number;
	createdBy: string;
	createdAt: string;
	status: string;
}

export interface FilterGoalSelect {
	goal_id: string;
	title: string;
	section: string | null;
	company: string | null;
	goalHours: number | null;
}

// [LOG TABLE TYPES]
export interface LogValues {
	log_id: string;
	date: string;
	fullDate?: string | Date;
	day?: string;
	timeIn: string;
	timeOut: string;
	breakOut?: string;
	breakBack?: string;
	breakDuration: string;
	description: string;
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

export interface TodayLogSelect {
	user_id: string;
	avatar_url: string;
	fullname: string;
	section: string;
	date: string;
	timeIn: string;
	timeOut: string;
	breakDuration: string;
	hoursWorked: string;
	description: string;
	createdAt: string;
}

// [STATISTICS TYPES]
export interface StatsticsSelect {
	todayLogs: number;
	completedGoals?: number;
	totalUsers: number;
	totalAdmins: number;
}

//
export type Paginated<T> = {
	data: T[];
	totalPages: number;
	error?: string | null;
};
