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

export interface GoalActiveState {
	goal_id: string;
	goalHours: number;
}

export interface GoalValues {
	goal_id?: string;
	title?: string;
	goal?: number;
}

export interface Goal {
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

export interface ContributorValues {
	token: string;
	section?: string;
	company?: string;
}

export interface WeeklyLogState {
	logs: WeeklyLogType[];
	currentHours: number;
	editLog: Log | null;
}

export interface WeeklyLogType {
	weekLabel: string;
	startDate: string;
	endDate: string;
	previousHours: string;
	thisPeriodHours: string;
	totalHours: string;
	rawTotalHours: number;
	logs: Log[];
}

export interface Log {
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
