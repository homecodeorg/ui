import { useState } from 'react';
import { Checkbox } from 'uilib';

export default () => {
  const [checked, setChecked] = useState(true);

  return (
    <Checkbox
      size="m"
      // variant="outlined"
      label="Set me on fire"
      onChange={() => setChecked(!checked)}
      checked={checked}
    />
  );
};
