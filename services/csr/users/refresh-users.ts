import { Dispatch, SetStateAction } from "react";
import { UserSelect } from "@/lib/types";
import { getUsers } from "@/services/ssr/users/initial-users";
import { supabaseBrowser } from "@/lib/supabase/client";

type RefreshUsersParams = {
	searchQuery: string;
	statusFilter: string;
	roleFilter: string;
	itemsPerPage: number;
	currentPage: number;
	showAlert: (status: number, message: string) => void;
	setUsersData: Dispatch<SetStateAction<UserSelect[]>>;
	setTotalPages: Dispatch<SetStateAction<number>>;
};

export const refreshUsers = async ({
	searchQuery,
	statusFilter,
	roleFilter,
	itemsPerPage,
	currentPage,
	showAlert,
	setUsersData,
	setTotalPages,
}: RefreshUsersParams) => {
	const { data, totalPages, error } = await getUsers(
		supabaseBrowser,
		searchQuery,
		statusFilter,
		roleFilter,
		itemsPerPage,
		currentPage,
	);

	if (error) {
		showAlert(500, error);
		return;
	}

	if (data) {
		setUsersData(data);
		setTotalPages(totalPages);
	}
};
