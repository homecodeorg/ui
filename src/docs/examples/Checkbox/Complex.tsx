import { useState } from 'react';
import { Checkbox } from 'uilib';

const sizes = ['xs', 's', 'm', 'l', 'xl'];
const variants = ['default', 'outlined'];

export default () => {
  const [checked, setChecked] = useState({});

  return sizes.map(size => (
    <div key={size}>
      {variants.map(variant => {
        const cellKey = `${size}-${variant}`;
        return (
          <Checkbox
            key={variant}
            size={size}
            variant={variant}
            className={S.item}
            label={variant}
            checked={checked[cellKey] ?? false}
            onChange={() =>
              setChecked(prev => ({
                ...prev,
                [cellKey]: !prev[cellKey],
              }))
            }
          />
        );
      })}
    </div>
  ));
};
