const TIME_ZONE = "Asia/Shanghai";
const NAIVE_DATE = /^(\d{4}-\d{2}-\d{2})(?:[ T](\d{2}:\d{2}(?::\d{2})?))?$/;

const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
	timeZone: TIME_ZONE,
	year: "numeric",
	month: "2-digit",
	day: "2-digit",
});

const dateTimeFormatter = new Intl.DateTimeFormat("zh-CN", {
	timeZone: TIME_ZONE,
	year: "numeric",
	month: "2-digit",
	day: "2-digit",
	hour: "2-digit",
	minute: "2-digit",
	hour12: false,
});

export function parseContentDate(value: unknown): Date {
	if (value instanceof Date) {
		if (Number.isNaN(value.getTime())) return value;
		// YAML timestamps without an offset are parsed as UTC; the content
		// convention is Asia/Shanghai wall time, so reinterpret the literal.
		return new Date(value.toISOString().replace("Z", "+08:00"));
	}
	if (typeof value === "string") {
		const naive = value.trim().match(NAIVE_DATE);
		if (naive) {
			return new Date(`${naive[1]}T${naive[2] ?? "00:00:00"}+08:00`);
		}
	}
	return new Date(value as string | number);
}

export function formatDate(date: Date): string {
	return dateFormatter.format(date);
}

export function formatDateTime(date: Date): string {
	return dateTimeFormatter.format(date);
}
