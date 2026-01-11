import { StudentContent } from "@/components/student/page";
import { getUser } from "@/services/ssr/auth/get-user";
import { getInitialGoal } from "@/services/ssr/goals/initial-goal";

export default async function StudentPage() {
	const user = await getUser();
	const initialGoal = user ? await getInitialGoal(user.id) : null;
	return <StudentContent initialGoal={initialGoal} />;
}
