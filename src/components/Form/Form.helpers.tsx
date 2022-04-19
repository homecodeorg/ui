import compare from 'compareq';

import { clone } from '../../tools/object';

export function patchWithCustomMessages(checkRes, validationSchema) {
  return checkRes.reduce((acc, { field, ...rest }) => {
    const customMessage =
      validationSchema[field]?.message ??
      validationSchema[field]?.messages?.[rest.type];

    if (customMessage) rest.message = customMessage;

    return { ...acc, [field]: rest };
  }, {});
}

export function dropFocusFromSubmit() {
  const focusedSubmit = document.querySelector(
    'button[type=submit]:focus'
  ) as HTMLButtonElement;

  focusedSubmit?.blur(); // eslint-disable-line
}

export function getInitialTouched(initialValues) {
  return Object.keys(initialValues).reduce(
    (acc, name) => ({ ...acc, [name]: false }),
    {}
  );
}

export function getNotEmpty(_defaultValues, values) {
  const defaultValues = _defaultValues || values;

  return Object.entries(values).reduce(
    (acc, [field, val]) =>
      compare(defaultValues[field], val) ? acc : { ...acc, [field]: true },
    {}
  );
}

export function getVal(e, val, valField) {
  if (val !== undefined) return val;
  return e?.target ? e.target[valField] : e;
}

function cloneValue(val) {
  if (typeof val === 'object' && val !== null) {
    // date
    if (val?._isAMomentObject) return val.clone();

    return clone(val);
  }

  return val;
}

export function cloneValues(values) {
  return Object.entries(values).reduce(
    (acc, [name, val]) => ({ ...acc, [name]: cloneValue(val) }),
    {}
  );
}
