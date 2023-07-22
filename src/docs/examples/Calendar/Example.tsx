import { Calendar } from 'uilib';

export default () => {
  return (
    <Calendar
      size="m"
      value={{ year: 2023, month: 7 }}
      // startOfWeek={0}
    />
  );
};
