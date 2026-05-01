import { useState } from 'react';
import { DropZone, Text } from 'uilib';

export default () => {
  const [names, setNames] = useState([]);

  return (
    <>
      <DropZone
        multiple
        accept="image/*"
        label="Drop images here (multiple)"
        onFiles={files => setNames(files.map(f => f.name))}
      />
      {names.length > 0 && (
        <Text>Selected ({names.length}): {names.join(', ')}</Text>
      )}
    </>
  );
};
