import { Status } from "./types";

// [USERS TABLE TYPES]
export type UserRow = {
	user_id: string;
	avatar_url: string | null;
	full_name: string | null;
	email: string;
	status: string | null;
	role: string | null;
	created_at: string | Date | null;
};

export type GoalAdminRow = {
	user_id: string;
	goal_id: number;
	full_name: string | null;
	email: string;
	avatar_url: string | null;
	role: string | null;
	status: string | null;
	created_at: string;
};

export type UserSummaryRow = {
	user_id: string;
	avatar_url: string | null;
	full_name: string | null;
	section: string | null;
	company: string | null;
	title: string | null;
	goal: number | null;
	total_hours: number | null;
	hours_left: number | null;
};

// [GOALS VIEW TYPE]
export type GoalRow = {
	goals: {
		goal_id: string;
		goal: number;
		status: string;
		sections: string[];
	} | null;
};

export type GoalTokenRow = {
	goal_id: string;
	title: string;
	goal: number;
	sections: string[];
	created_by: string;
};

export type FilterGoalRow = {
	goal_id: string;
	section: string | null;
	company: string | null;
	goals: {
		title: string;
		goal: number;
	} | null;
};

export type RegisteredGoalRow = {
	goal_id: string;
	title: string;
	goal: number;
	created_at: string;
	status: string;
	created_by: string;
	users: {
		full_name: string | null;
	} | null;
};

export type UserGoalViewRow = {
	goal_id: string;
	title: string;
	goal: number;
	goal_status: Status;
	contributor_status: Status;
	created_at: string;
	created_by: string | null;
	sections: string[] | null;
	meta_text: string | null;
	pubToken?: string | null;
	priToken?: string | null;
};

// [LOGS VIEW TYPE]
export type LogRow = {
	log_id: string;
	log_date: string;
	timeIn: string | null;
	timeOut: string | null;
	breakOut: string | null;
	breakBack: string | null;
	description: string | null;
};

export type TodayLogsViewRow = {
	user_id: string | null;
	avatar_url: string | null;
	full_name: string | null;
	section: string | null;
	log_date: string;
	time_in: string | null;
	time_out: string | null;
	break_out: string | null;
	break_back: string | null;
	description: string | null;
	created_at: string | null;
};
