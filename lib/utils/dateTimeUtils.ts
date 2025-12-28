// utils/dateTimeUtils.ts

export const toISODate = (d: Date | string | undefined) => {
	try {
		if (!d) return "";
		return new Date(d).toISOString().split("T")[0];
	} catch (e) {
		return "";
	}
};

export const convert12To24 = (t?: string) => {
	if (!t) return "";
	const m = t.match(/(\d{1,2}):(\d{2})\s*([ap]m)/i);
	if (!m) return "";
	let hh = parseInt(m[1], 10);
	const mm = m[2];
	const ampm = m[3].toLowerCase();
	if (ampm === "pm" && hh !== 12) hh += 12;
	if (ampm === "am" && hh === 12) hh = 0;
	return `${hh.toString().padStart(2, "0")}:${mm}`;
};

export const combineDateTime = (date: string, time?: string) => {
	if (!date || !time) return null;
	return `${date}T${time}:00`;
};

export const formatDuration = (hours: number) => {
	const h = Math.floor(hours);
	const m = Math.round((hours - h) * 60);
	if (h === 0 && m === 0) return "0min";
	if (h === 0) return `${m}min`;
	if (m === 0) return `${h}hr`;
	return `${h}hr ${m}min`;
};
