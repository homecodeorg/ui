/**
 * Convert ISO 8601 format ("YYYY-MM-DD") to Date object
 * @param str
 * @returns Date
 */
export const strToDate = (str: string) => {
  const [year, month, day] = str.split('-').map(Number);
  return new Date(year, month - 1, day);
};
