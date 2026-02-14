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
	const isNegative = hours < 0;
	const absHours = Math.abs(hours);
	const h = Math.floor(absHours);
	const m = Math.round((absHours - h) * 60);

	const signPrefix = isNegative ? "-" : "";

	if (h === 0 && m === 0) return "0min";
	if (h === 0) return `${signPrefix}${m}${m === 1 ? "min" : "mins"}`;
	if (m === 0) return `${signPrefix}${h}${h === 1 ? "hr" : "hrs"}`;
	return `${signPrefix}${h}${h === 1 ? "hr" : "hrs"} ${m}${m === 1 ? "min" : "mins"}`;
};

export const getPHDate = () => {
	return new Date().toLocaleDateString("en-CA", {
		timeZone: "Asia/Manila",
	});
};

export const getCurrentDateLong = () => {
	return new Date().toLocaleDateString("en-US", {
		timeZone: "Asia/Manila",
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

export const formatPHDateTime = (date: string | Date | null | undefined) => {
	if (!date) return "--:--";

	try {
		const dateObj = new Date(date);
		return dateObj.toLocaleDateString("en-US", {
			timeZone: "Asia/Manila",
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		});
	} catch (error) {
		return "--:--";
	}
};
