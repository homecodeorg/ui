import { useState } from 'react';
import { DropZone } from 'uilib';

export default () => {
  const [name, setName] = useState(null);

  return (
    <>
      <span>Drag a file anywhere over the page — overlay appears while dragging.</span>
      <DropZone
        ghost
        accept=".txt,text/plain"
        label="Release to upload a text file"
        onFile={file => setName(file.name)}
      />
    </>
  );
};
