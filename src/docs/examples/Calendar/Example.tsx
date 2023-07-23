import { Calendar } from 'uilib';

const date = { year: 2023, month: 7, day: 31 };

export default () => {
  return (
    <Calendar
      size="m"
      value={date}
      // startOfWeek={0}
      isDayDisabled={d =>
        d.year <= date.year &&
        (d.month < date.month || (d.month === date.month && d.day < 10))
      }
    />
  );
};
