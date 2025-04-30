import cn from 'classnames';

import { strToDate } from 'uilib/tools/date';
import { DateTime } from 'uilib/components/DateTime/DateTime';
import { DatePicker } from 'uilib/components/DatePicker/DatePicker';
import { Button } from 'uilib/components/Button/Button';
import { Popup } from 'uilib/components/Popup/Popup';

import * as T from './DatePickerInput.types';
import S from './DatePickerInput.styl';

export function DatePickerInput(props: T.Props) {
  const {
    value,
    variant = 'default',
    size = 'm',
    popupProps,
    displayFormat = 'MMM Do YYYY',
  } = props;

  const isRange = Array.isArray(value);

  return (
    <Popup
      size={size}
      focusControl
      direction="bottom-right"
      {...popupProps}
      trigger={
        // @ts-ignore
        <Button variant={variant} size={size}>
          {isRange ? (
            <>
              <DateTime value={strToDate(value[0])} format={displayFormat} />
              {' - '}
              <DateTime value={strToDate(value[1])} format={displayFormat} />
            </>
          ) : (
            <DateTime value={strToDate(value)} format={displayFormat} />
          )}
        </Button>
      }
      contentProps={{
        className: cn(
          S.popupContent,
          props.doubleCalendar && S.doubleCalendar,
          S[`size-${size}`],
          popupProps?.contentProps?.className
        ),
      }}
      content={
        <DatePicker
          {...props}
          className={S.content}
          calendarProps={{ className: S.calendar }}
        />
      }
    />
  );
}
