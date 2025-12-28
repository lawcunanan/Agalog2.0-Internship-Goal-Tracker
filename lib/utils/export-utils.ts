import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import { UserDetails, WeeklyLogState } from "../types";

export const exportExcel = async (
	logState: WeeklyLogState,
	userDetails: UserDetails | null,
	showAlert: (status: number, message: string) => void,
) => {
	if (!logState || !userDetails) return;

	try {
		const workbook = new ExcelJS.Workbook();
		const sheet = workbook.addWorksheet("Weekly Attendance");

		const bannerResponse = await fetch("/banner.png");
		const bannerBlob = await bannerResponse.blob();
		const bannerBuffer = await bannerBlob.arrayBuffer();
		const bannerId = workbook.addImage({
			buffer: bannerBuffer,
			extension: "png",
		});

		sheet.addImage(bannerId, {
			tl: { col: 13, row: 1 },
			ext: { width: 300, height: 100 },
		});

		const spacerColumns = Array(12).fill({ width: 5 });
		sheet.columns = [
			...spacerColumns,
			{ width: 20 }, // M - Date
			{ width: 15 }, // N - Time In
			{ width: 15 }, // O - Time Out
			{ width: 15 }, // P - Break
			{ width: 15 }, // Q - Total
		];

		sheet.mergeCells("M10:Q10");
		const greetingCell = sheet.getCell("M10");
		greetingCell.value = `Hello, ${userDetails.full_name || "User"}!`;
		greetingCell.font = { name: "Arial", size: 14, bold: true };
		greetingCell.alignment = { vertical: "middle", horizontal: "left" };

		const goals = logState.goalHours || [];
		const remaining = Math.max(0, logState.goalHours - logState.currentHours);

		sheet.mergeCells("M11:Q11");
		const summaryCell1 = sheet.getCell("M11");
		summaryCell1.value = `Current Hours: ${logState.currentHours.toFixed(
			2,
		)} / Goal: ${goals} hours`;
		summaryCell1.font = { bold: true };
		summaryCell1.alignment = { horizontal: "left" };

		sheet.mergeCells("M12:Q12");
		const summaryCell2 = sheet.getCell("M12");
		summaryCell2.value = `Remaining Hours: ${remaining.toFixed(
			2,
		)} hours to reach your goal.`;
		summaryCell2.alignment = { horizontal: "left" };

		let currentRow = 14;

		const chronologicalWeeks = [...logState.logs].reverse();

		chronologicalWeeks.forEach((week) => {
			// Week Header
			sheet.mergeCells(`M${currentRow}:Q${currentRow}`);
			const weekCell = sheet.getCell(`M${currentRow}`);
			weekCell.value = `${week.weekLabel} (${week.startDate} - ${week.endDate})`;
			weekCell.fill = {
				type: "pattern",
				pattern: "solid",
				fgColor: { argb: "FF1D4ED8" }, // blue-700
			};
			weekCell.font = { color: { argb: "FFFFFFFF" }, bold: true };
			sheet.getRow(currentRow).height = 25; // Add padding (height)
			weekCell.alignment = { vertical: "middle", horizontal: "center" };
			currentRow++;

			// Table Header
			const headers = [
				...Array(12).fill(""),
				"Date",
				"Time In",
				"Time Out",
				"Break",
				"Total",
			];
			const headerRow = sheet.getRow(currentRow);
			headerRow.values = headers;
			headerRow.height = 20; // Add padding (height)
			headerRow.eachCell((cell, colNumber) => {
				if (colNumber >= 13) {
					// Only style columns M-Q
					cell.font = { bold: true };
					cell.border = { bottom: { style: "thin" } };
					cell.alignment = { vertical: "middle", horizontal: "center" };
				}
			});
			currentRow++;

			// Logs
			week.logs.forEach((log) => {
				const row = sheet.getRow(currentRow);
				row.values = [
					...Array(12).fill(""),
					log.date,
					log.timeIn,
					log.timeOut,
					log.breakDuration,
					log.hoursWorked,
				];
				row.eachCell((cell, colNumber) => {
					if (colNumber >= 13) {
						cell.alignment = { horizontal: "center" };
					}
				});
				currentRow++;
			});

			// Week Summary
			const summaryData = [
				{ label: "Previous Hours", value: week.previousHours },
				{ label: "This Period Hours", value: week.thisPeriodHours },
				{ label: "Total Hours", value: week.totalHours },
			];

			summaryData.forEach((item) => {
				const row = sheet.getRow(currentRow);
				row.getCell(13).value = item.label; // M
				row.getCell(17).value = item.value; // Q
				row.getCell(13).font = { bold: true };
				row.getCell(17).font = { bold: true };
				row.getCell(17).alignment = { horizontal: "center" };
				currentRow++;
			});

			currentRow += 2;
		});

		// Footer
		currentRow++;
		sheet.mergeCells(`M${currentRow}:Q${currentRow}`);
		const footerCell = sheet.getCell(`M${currentRow}`);
		footerCell.value =
			"© 2025 Agalog: Internship Goal Tracker\nDeveloper: Lawrence S. Cunanan";
		footerCell.font = { name: "Arial", size: 10, color: { argb: "FF555555" } };
		footerCell.alignment = {
			vertical: "middle",
			horizontal: "center",
			wrapText: true,
		};
		sheet.getRow(currentRow).height = 40;

		const buffer = await workbook.xlsx.writeBuffer();
		const blob = new Blob([buffer], {
			type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		});
		saveAs(blob, "Weekly_Attendance.xlsx");
	} catch (error) {
		console.error("Export failed:", error);
		showAlert(500, "Failed to export Excel file");
	}
};
