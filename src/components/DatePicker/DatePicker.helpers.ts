import type { Date } from 'uilib/types';

export function dateToString(date: Date) {
  return `${date.year}-${date.month}-${date.day}`;
}

export function strigToDate(dateString: string) {
  const [year, month, day] = dateString.split('-');
  return {
    year: Number(year),
    month: Number(month),
    day: Number(day),
  };
}

export function isDateEqual(date1: Date, date2: Date) {
  return (
    date1.year === date2.year &&
    date1.month === date2.month &&
    date1.day === date2.day
  );
}

export function isDateBefore(date1: Date, date2: Date) {
  return (
    date1.year < date2.year ||
    (date1.year === date2.year && date1.month < date2.month) ||
    (date1.year === date2.year &&
      date1.month === date2.month &&
      date1.day < date2.day)
  );
}

export function isDateAfter(date1: Date, date2: Date) {
  return isDateBefore(date2, date1);
}

export function isDateBetween(date: Date, startDate: Date, endDate: Date) {
  return isDateAfter(date, startDate) && isDateBefore(date, endDate);
}
