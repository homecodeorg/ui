import { useState } from 'react';
// eslint-ignore-next-line multiline-ternary
import { Button, Checkbox, Heading, Input, RadioButton, RadioGroup, Scroll, Toggle } from 'uilib';


const sizes = ['xs', 's', 'm', 'l', 'xl'];
const buttonVariants = ['text', 'clear', 'default', 'outlined', 'primary'];
const boxVariants = ['default', 'outlined'];

const inputTypes = [
  { type: 'text', label: 'text' },
  { type: 'password', label: 'password' },
  { type: 'number', label: 'number' },
  { type: 'email', label: 'email' },
  { type: 'tel', label: 'tel' },
  { type: 'search', label: 'search' },
  { type: 'url', label: 'url' },
  { type: 'textarea', label: 'textarea' },
];

export default () => {
  const [checkboxChecked, setCheckboxChecked] = useState({});
  const [toggleChecked, setToggleChecked] = useState({});
  const [inputValues, setInputValues] = useState(() =>
    Object.assign(
      {},
      Object.fromEntries(inputTypes.map(({ type }) => [type, ''])),
      Object.fromEntries(sizes.map(size => [`text-${size}`, '']))
    )
  );

  return (
    <Scroll y fadeSize="m" offset={{ y: { before: 20, after: 20 } }} className={S.scroll}>
      <div className={S.section}>
        <Heading id="gallery-buttons" text="Button" />
        {sizes.map(size => (
          <div key={size} className={S.row}>
            {buttonVariants.map(variant => (
              <Button
                key={variant}
                size={size}
                variant={variant}
                className={S.item}
              >
                {variant}
              </Button>
            ))}
          </div>
        ))}
      </div>

      <div className={S.section}>
        <Heading id="gallery-inputs-types" text="Input — types" />
        <div className={S.inputGrid}>
          {inputTypes.map(({ type, label }) => (
            <Input
              key={type}
              type={type}
              size="m"
              variant="default"
              label={label}
              value={inputValues[type] ?? ''}
              onChange={(_e, val) =>
                setInputValues(prev => ({ ...prev, [type]: String(val) }))
              }
            />
          ))}
        </div>
        <Heading id="gallery-inputs-sizes" text="Input — text sizes" />
        <div className={S.inputSizeRow}>
          {sizes.map(size => (
            <Input
              key={size}
              type="text"
              size={size}
              variant="default"
              label={`text (${size})`}
              value={inputValues[`text-${size}`] ?? ''}
              onChange={(_e, val) =>
                setInputValues(prev => ({
                  ...prev,
                  [`text-${size}`]: String(val),
                }))
              }
            />
          ))}
        </div>
      </div>

      <div className={S.section}>
        <Heading id="gallery-checkbox" text="Checkbox" />
        {sizes.map(size => (
          <div key={size} className={S.row}>
            {boxVariants.map(variant => {
              const cellKey = `cb-${size}-${variant}`;
              return (
                <Checkbox
                  key={variant}
                  size={size}
                  variant={variant}
                  className={S.matrixItem}
                  label={variant}
                  checked={checkboxChecked[cellKey] ?? false}
                  onChange={() =>
                    setCheckboxChecked(prev => ({
                      ...prev,
                      [cellKey]: !prev[cellKey],
                    }))
                  }
                />
              );
            })}
          </div>
        ))}
      </div>

      <div className={S.section}>
        <Heading id="gallery-toggle" text="Toggle" />
        {sizes.map(size => {
          const cellKey = `tg-${size}`;
          return (
            <div key={size} className={S.row}>
              <Toggle
                size={size}
                className={S.matrixItem}
                label={size}
                checked={toggleChecked[cellKey] ?? false}
                onChange={() =>
                  setToggleChecked(prev => ({
                    ...prev,
                    [cellKey]: !prev[cellKey],
                  }))
                }
              />
            </div>
          );
        })}
      </div>

      <div className={S.section}>
        <Heading id="gallery-radio" text="RadioGroup" />
        <div className={S.radioMatrix}>
          {sizes.flatMap(size =>
            boxVariants.map(variant => (
              <div key={`${size}-${variant}`} className={S.radioBlock}>
                <RadioGroup
                  label={`${size} / ${variant}`}
                  size={size}
                  variant={variant}
                  defaultValue="b"
                >
                  <RadioButton value="a" label="A" />
                  <RadioButton value="b" label="B" />
                  <RadioButton value="c" label="C" />
                </RadioGroup>
              </div>
            ))
          )}
        </div>
        <div className={S.extraRow}>
          <RadioGroup
            label="horizontal"
            orientation="horizontal"
            defaultValue="x"
            size="m"
          >
            <RadioButton value="x" label="X" />
            <RadioButton value="y" label="Y" />
            <RadioButton value="z" label="Z" />
          </RadioGroup>
        </div>
        <div className={S.extraRow}>
          <RadioGroup label="disabled" disabled defaultValue="on" size="m">
            <RadioButton value="on" label="On" />
            <RadioButton value="off" label="Off" />
          </RadioGroup>
        </div>
        <div className={S.extraRow}>
          <RadioGroup label="error" error defaultValue="one" size="m">
            <RadioButton value="one" label="One" />
            <RadioButton value="two" label="Two" />
          </RadioGroup>
        </div>
      </div>
    </Scroll>
  );
};
