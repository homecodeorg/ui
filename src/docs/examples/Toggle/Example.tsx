import { useState } from 'react';
import { Toggle } from 'uilib';

export default () => {
  const [checked, setChecked] = useState(true);

  return ['xs', 's', 'm', 'l', 'xl'].map(size => (
    <div>
      <Toggle
        size={size}
        label={`Toggle ${size}`}
        onChange={() => setChecked(!checked)}
        checked={checked}
      />
    </div>
  ));
};
