import type { Moment } from 'moment';

export type Props = {
  // Date and time to display.
  //
  // If no value is provided, the component will default to the current date and time.
  value?: Date | Moment | string;
  // Format in which to display the date and time.
  //
  // If no format is provided, the component will display the date and time using the default format.
  //
  // See [moment.js/format](https://momentjs.com/docs/#/displaying/format) for more details.
  format?: string;
  // Locale in which to display the date and time. If no locale is provided, the component
  // follows the active i18n language (app codes like "ua" map to moment's "uk"), so it
  // re-renders on a language switch. The app must load the moment locale data
  // (`import 'moment/locale/uk'`); without it, moment falls back to English.
  locale?: string;
};
