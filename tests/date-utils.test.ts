import { describe, expect, it } from "vitest";
import {
	formatDate,
	formatDateTime,
	parseContentDate,
} from "../src/utils/date-utils";

describe("parseContentDate", () => {
	it("interprets naive datetimes as Asia/Shanghai", () => {
		expect(parseContentDate("2026-02-19 17:24:00").toISOString()).toBe(
			"2026-02-19T09:24:00.000Z",
		);
	});

	it("interprets naive dates as Asia/Shanghai midnight", () => {
		expect(parseContentDate("2026-02-19").toISOString()).toBe(
			"2026-02-18T16:00:00.000Z",
		);
	});

	it("reinterprets YAML timestamps as Asia/Shanghai wall time", () => {
		const parsed = parseContentDate(new Date("2026-02-19T17:24:00.000Z"));
		expect(parsed.toISOString()).toBe("2026-02-19T09:24:00.000Z");
	});

	it("respects explicit offsets", () => {
		expect(parseContentDate("2026-02-19T17:24:00+08:00").toISOString()).toBe(
			"2026-02-19T09:24:00.000Z",
		);
	});
});

describe("date formatting", () => {
	it("formats datetimes in Asia/Shanghai", () => {
		expect(formatDateTime(new Date("2026-02-19T09:24:00.000Z"))).toBe(
			"2026/02/19 17:24",
		);
	});

	it("formats dates in Asia/Shanghai", () => {
		expect(formatDate(new Date("2026-02-18T16:30:00.000Z"))).toBe("2026/02/19");
	});
});
