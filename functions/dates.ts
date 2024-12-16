// Sorting array of dates in ascending order
export const dateSorterAsc = (dateList: string[]) =>
  dateList.sort((dateString1, dateString2) => {
    const [year1, month1, day1] = dateString1.split("-").map(Number);
    const [year2, month2, day2] = dateString2.split("-").map(Number);

    return year1 - year2 || month1 - month2 || day1 - day2;
  });
