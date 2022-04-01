import { useCallback, useState } from 'react';
import { InputFile, Form, SubmitButtons } from 'uilib';

let demandUploader;

export default () => {
  const [initialValues, setInitialValues] = useState({ photos: [] });

  const onSubmit = useCallback(async function () {
    const photos = await demandUploader(upload);

    setInitialValues({ photos });
  }, []);

  const renderFields = useCallback(
    ({ Field, isLoading, isValid, isDirty }) => (
      <>
        <Field
          name="photos"
          component={InputFile}
          size="m"
          label="Photos"
          uploadOnDemand={fn => (demandUploader = fn)}
          maxCount={5}
          accept="image/png, image/jpeg"
        />
        <SubmitButtons
          buttons={[
            {
              type: 'submit',
              children: 'Submit',
              isLoading,
              key: 'submit',
              disabled: !isValid || !isDirty,
            },
          ]}
        />
      </>
    ),
    []
  );

  return (
    <Form
      initialValues={initialValues}
      validationSchema={{
        photos: { type: 'array', items: 'string', empty: false },
      }}
      onSubmit={onSubmit}
    >
      {renderFields}
    </Form>
  );
};
