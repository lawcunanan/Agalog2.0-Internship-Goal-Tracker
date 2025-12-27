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
