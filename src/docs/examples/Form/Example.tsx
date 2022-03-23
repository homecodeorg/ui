import { Form, SubmitButtons, Select } from 'uilib';

const initialValues = {
  name: 'Alise',
  age: 18,
  groupId: null,
};
const validationSchema = {
  name: { type: 'string', empty: false },
  age: { type: 'number', min: 18 },
  groupId: { type: 'number', empty: false },
};

const groupsOptions = [
  { id: 1, label: 'group 1' },
  { id: 2, label: 'group 2' },
  { id: 3, label: 'group 3' },
];

export default () => {
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
