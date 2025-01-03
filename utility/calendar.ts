export const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// prevYearsRange is the range on how many previous years will be shown
// forwYearsRange is the range on how many forward years will be shown
const prevYearsRange = 8;
const forwYearsRange = 1;
const currentYear = new Date().getFullYear();
export const years = Array.from({ length: currentYear - new Date().getFullYear() + prevYearsRange + forwYearsRange + 1 }, (_, i) => currentYear - prevYearsRange + i);
