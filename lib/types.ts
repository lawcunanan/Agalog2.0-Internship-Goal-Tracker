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

export interface WeeklyAttendanceState {
	logs: WeeklyAttendanceType[];
	goalHours: number;
	currentHours: number;
	editLog: Log | null;
}

export interface WeeklyAttendanceType {
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
