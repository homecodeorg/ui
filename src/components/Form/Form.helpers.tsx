export function patchWithCustomMessages(checkRes, validationSchema) {
  return checkRes.reduce((acc, { field, ...rest }) => {
    const customMessage = validationSchema[field]?.messages?.[rest.type];

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

export function getVal(e, val, valField = 'value') {
  if (val !== undefined) return val;
  if (e === null) return null;
  return e.target ? e.target[valField] : e;
}
