import { useState } from 'react';
import { Button, ButtonGroup, Progress, ProgressCircular } from 'uilib';

export default () => {
  const [value, setValue] = useState(50);
  const [size, setSize] = useState('l');

  return (
    <div>
      <Button
        onClick={() => {
          const newVal = value + 10;
          setValue(newVal > 100 ? 0 : newVal);
        }}
      >
        Increment
      </Button>
      &nbsp;
      <ButtonGroup style={{ display: 'inline-flex' }}>
        {['s', 'm', 'l'].map(s => (
          <Button onClick={() => setSize(s)} checked={s === size}>
            {s}
          </Button>
        ))}
      </ButtonGroup>
      <br />
      <br />
      <ProgressCircular
        value={value}
        size={size}
        strokeWidth={2}
        showPercentage
      />
      <Progress value={value} size={size} showPercentage />
    </div>
  );
};
