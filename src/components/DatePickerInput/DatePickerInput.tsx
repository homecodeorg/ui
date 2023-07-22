import cn from 'classnames';

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
        <Button variant={variant} size={size}>
          {isRange ? (
            <>
              <DateTime
                value={
                  new Date(value[0].year, value[0].month - 1, value[0].day)
                }
                format={displayFormat}
              />
              {' - '}
              <DateTime
                value={
                  new Date(value[1].year, value[1].month - 1, value[1].day)
                }
                format={displayFormat}
              />
            </>
          ) : (
            <DateTime
              value={new Date(value.year, value.month - 1, value.day)}
              format={displayFormat}
            />
          )}
        </Button>
      }
      contentProps={{
        className: cn(S.popupContent, isRange && S.range, S[`size-${size}`]),
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
