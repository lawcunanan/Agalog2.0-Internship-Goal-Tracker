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

// Goal details stored in redux state
export interface GoalValues {
	goal_id?: string;
	title?: string;
	goal?: number;
}

export interface GoalActiveState {
	goal_id: string;
	goalHours: number;
}

export interface GoalSelect {
	goal_id: string;
	title: string;
	status: "Active" | "Inactive";
	goal: number;
	metaText: string;
	pubToken?: string | null;
	priToken?: string | null;
	created_by: string;
	created_at: string;
}

// Contributor details stored in redux state
export interface ContributorValues {
	token: string;
	section?: string;
	company?: string;
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
	editLog: LogValues | null;
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

//Admin section details stored in redux state

export interface TodayLogsSelect {
	user_id: string;
	picture: string;
	fullname: string;
	section: string;
	date: string;
	timeIn: string;
	timeOut: string;
	breakDuration: string;
	description: string;
	hoursWorked: string;
	createdAt: string;
}

export interface UserSummarySelect {
	user_id: string;
	picture: string;
	fullname: string;
	section: string;
	company: string;
	goalTitle: string;
	goalHours: number;
	totalHours: string;
	hoursLeft: string;
}

export interface GoalAdminSelect {
	user_id?: string;
	picture?: string;
	fullname: string;
	email?: string;
	role?: string;
	status?: string;
	createdAt?: string;
}

export interface UsersSelect {
	user_id: string;
	picture: string;
	fullname: string;
	email: string;
	status: string;
	role: string;
	createdAt: string;
}

export interface GoalsSelect {
	goal_id: string;
	title: string;
	goalHours: number;
	createdBy: string;
	createdDate: string;
	status: string;
}
