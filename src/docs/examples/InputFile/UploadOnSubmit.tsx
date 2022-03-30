import { useCallback, useState } from 'react';
import { InputFile, Form, SubmitButtons, file } from 'uilib';

let filesCache = {}; // [index]: File

export default () => {
  const [initialValues, setInitialValues] = useState({ photos: [] });
  const [uploadStatus, setUploadStatus] = useState([]); // [{ total, loaded },...]

  const onFilesCoose = useCallback(async function (items, values, setValue) {
    const vals = [...values.photos];
    const requests = {};

    items.forEach((item, i) => {
      if (!item) return;
      filesCache[i] = item;
      requests[i] = file.toBase64(item).then(src => (vals[i] = src));
    });

    await Promise.all(Object.values(requests));

    console.log('onFilesCoose', vals);

    setValue('photos', vals);
  }, []);

  const onProgress = useCallback(
    i => e => {
      const newProgress = [...uploadStatus];
      newProgress[i] = e;

      setUploadStatus(newProgress);
    },
    [uploadStatus]
  );

  const onSubmit = useCallback(async function (values) {
    const requests = [];
    const photos = [...values.photos];

    values.photos.forEach((val, i) => {
      if (filesCache[i]) {
        console.log('files[i]', i, filesCache[i]);
        requests.push(
          upload(filesCache[i], onProgress(i)).then(url => (photos[i] = url))
        );
      }
    });

    await Promise.all(requests);

    filesCache = {};

    setInitialValues({ photos });
  }, []);

  const renderFields = useCallback(
    ({ Field, isLoading, isValid, isDirty, values, setValue }) => (
      <>
        <Field
          name="photos"
          component={InputFile}
          size="m"
          label="Photos"
          onFilesCoose={files => onFilesCoose(files, values, setValue)}
          uploadStatus={uploadStatus}
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
    [uploadStatus]
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
