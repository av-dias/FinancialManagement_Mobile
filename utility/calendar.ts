export const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// prevYearsRange is the range on how many previous years will be shown
// forwYearsRange is the range on how many forward years will be shown
const prevYearsRange = 8;
const forwYearsRange = 1;
export const years = Array.from({ length: 2024 - new Date().getFullYear() + prevYearsRange + forwYearsRange + 1 }, (_, i) => 2024 - prevYearsRange + i);
