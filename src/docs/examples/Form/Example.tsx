import { Form, SubmitButtons, Select } from 'uilib';
import { useState, useEffect } from 'react';

const INITIAL_VALUES = {
  name: 'Alise',
  age: 18,
  groupId: [],
};

const validationSchema = {
  name: { type: 'string', empty: false },
  age: { type: 'number', min: 18 },
  groupId: { type: 'array', items: 'number', empty: false },
};

const groupsOptions = [
  { id: 1, label: 'group 1' },
  { id: 2, label: 'group 2' },
  { id: 3, label: 'group 3' },
];

export default () => {
  const [initialValues, setInitialValues] = useState(INITIAL_VALUES);

  console.log('initialValues', initialValues);
  useEffect(() => {
    console.log('initial useEffect()');
    setTimeout(() => {
      console.log('setInitialValues.... Bob');
      setInitialValues({ ...INITIAL_VALUES, name: 'Bob' });
    }, 1000);
  }, []);

  return (
    <Form
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={values => alert(JSON.stringify(values))}
    >
      {({ Field, isDirty, isValid, isLoading, reset }) => (
        <>
          <Field name="name" label="Name" />
          <Field name="age" label="Age" type="number" />
          <Field
            name="groupId"
            label="Group"
            component={Select}
            options={groupsOptions}
            popupProps={{ direction: 'top' }}
          />
          <SubmitButtons
            buttons={[
              {
                key: 'reset',
                children: 'Reset',
                size: 'm',
                disabled: !isDirty,
                onClick: reset,
              },
              {
                key: 'submit',
                children: 'Send',
                type: 'submit',
                size: 'm',
                disabled: !isValid,
                isLoading,
              },
            ]}
          />
        </>
      )}
    </Form>
  );
};
