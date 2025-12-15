export const formatDuration = (hours: number) => {
	const h = Math.floor(hours);
	const m = Math.round((hours - h) * 60);
	if (h === 0 && m === 0) return "0min";
	if (h === 0) return `${m}min`;
	if (m === 0) return `${h}hr`;
	return `${h}hr ${m}min`;
};
