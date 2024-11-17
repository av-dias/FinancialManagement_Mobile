export const logTimeTook = (domain: string, type: string, endTime: number, startTime: number) => {
  console.log(`${domain}: ${type} took ${(endTime - startTime).toFixed(2)} milliseconds.`);
};
