export const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// prevYearsRange is the range on how many previous years will be shown
// forwYearsRange is the range on how many forward years will be shown
export const prevYearsRange = 8;
export const calendarOffset = 0;
const forwYearsRange = 1;
const currentYear = new Date().getFullYear();
export const years = Array.from(
  { length: currentYear - new Date().getFullYear() + prevYearsRange + forwYearsRange + 1 },
  (_, i) => currentYear - prevYearsRange + i
);
export const calendarDateRange = years.slice(calendarOffset).flatMap((y) => months.map((m) => ({ month: m, year: y })));
export const calendarYearsRange = years.slice(calendarOffset).map((y) => ({ month: null, year: y }));

export function getMonthsBetween(startMonth: number, startYear: number, endMonth: number, endYear: number): number {
  return (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
}
