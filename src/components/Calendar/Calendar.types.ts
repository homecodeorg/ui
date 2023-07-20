import { Size } from 'uilib/types';

export type Value = {
  year: number;
  month: number;
  day?: number;
  currentMonth?: boolean;
};

export type Props = {
  value: Value;
  onDayClick: (value: Value) => void;
  // Day of week to start calendar from  1(Monday)..0(Sunday). Default: 1
  startOfWeek?: number;
  size?: Size;
  // Function to render custom week days label
  renderWeekDayLabel?: (day: number) => React.ReactNode;
  // Function to render custom year label
  renderYearLabel?: (year: number) => React.ReactNode;
  // Function to render custom monthes label
  renderMonthesLabel?: (month: number) => React.ReactNode;
  // Function to render custom each month label
  renderMonthLabel?: (month: number) => React.ReactNode;
  // Class name for weekend days
  weekendClassName?: string;
};
