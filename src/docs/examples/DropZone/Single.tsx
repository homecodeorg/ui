import { useState } from 'react';
import { DropZone, Text } from 'uilib';

export default () => {
  const [name, setName] = useState(null);

  return (
    <>
      <DropZone
        accept="image/png,image/jpeg,.pdf"
        label="Drop a file or click to browse"
        onFile={file => setName(file.name)}
      />
      {name && <Text>Selected: {name}</Text>}
    </>
  );
};
