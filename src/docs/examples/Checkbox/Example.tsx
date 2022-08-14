import { useState } from 'react';
import { Checkbox } from 'uilib';

export default () => {
  const [checked, setChecked] = useState(true);

  return (
    <Checkbox
      size="m"
      label="I'm a checkbutton"
      onChange={() => setChecked(!checked)}
      checked={checked}
    />
  );
};
