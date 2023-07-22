import { ReactNode } from 'react';
import { Size, Date } from 'uilib/types';

export type Day = Date & {
  currentMonth?: boolean;
};

export type DayProps = {
  className: string;
  onClick: () => void;
};

export type Props = {
  value: Date;
  onDayClick: (value: Date) => void;
  // Day of week to start calendar from  1(Monday)..0(Sunday). Default: 1
  startOfWeek?: number;
  size?: Size;
  // Function to render custom day. If not provided, then default day will be rendered.
  // NOTE: `classes` needs for applying styles of default layout.
  renderDay?: (day: Day, dayProps: DayProps) => ReactNode;
  // Function to render custom week days label
  renderWeekDayLabel?: (day: number) => ReactNode;
  // Function to render custom year label
  renderYearLabel?: (year: number) => string;
  // Function to render custom monthes label
  renderMonthesLabel?: (month: number) => string;
  // Function to render custom each month label
  renderMonthLabel?: (month: number) => string;
  // Class name for weekend days
  weekendClassName?: string;
};
