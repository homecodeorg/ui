import { DateTime } from 'uilib';

const date = moment().add(2, 'day');

export default () => {
  return (
    <DateTime
      value={date}
      // format="DD.MM.YYYY"
      format="toNow"
      locale="ru"
    />
  );
};
