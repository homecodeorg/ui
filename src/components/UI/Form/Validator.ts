import FastestValidator from 'fastest-validator';

export const Validator = new FastestValidator({
  messages: {
    momentDate: 'Invalid date',
    momentRange: 'Invalid dates range',
  },
});

Validator.add('momentDate', function momentDate({ messages }) {
  return {
    source: `
      if (!value.isValid())
        // @ts-ignore
        ${this.makeError({ type: 'momentDate', actual: 'value', messages })}

      return value;
    `,
  };
});

Validator.add('momentRange', function momentRange({ messages }) {
  return {
    source: `
      const isValid =
        value.startDate && value.startDate.isValid() &&
        value.endDate && value.endDate.isValid();

      if (!isValid)
        // @ts-ignore
        ${this.makeError({ type: 'momentRange', actual: 'value', messages })}

      return value;
    `,
  };
});
