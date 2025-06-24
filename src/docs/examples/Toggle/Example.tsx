import { useState } from 'react';
import { Toggle } from 'uilib';

export default () => {
  const [checked, setChecked] = useState(true);

  ['s', 'm', 'l'].map(size => (
    <Toggle
      size={size}
      label={`Toggle ${size}`}
      onChange={() => setChecked(!checked)}
      checked={checked}
    />
  ));
};
