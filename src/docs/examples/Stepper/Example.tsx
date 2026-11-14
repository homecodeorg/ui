import { useState } from 'react';
import { Input, Stepper, Toggle } from 'uilib';

export default () => {
  const [name, setName] = useState('');
  const [advanced, setAdvanced] = useState(false);
  const [done, setDone] = useState(false);

  const steps = [
    {
      id: 'name',
      title: 'Describe',
      description: 'What should it be called?',
      content: (
        <Input
          label="Name"
          value={name}
          onChange={(e, v) => setName(v)}
        />
      ),
      next: { disabled: !name },
    },
    {
      id: 'mode',
      title: 'Mode',
      description: 'More steps appear when you turn this on.',
      content: (
        <Toggle
          label="Advanced settings"
          checked={advanced}
          onChange={() => setAdvanced(!advanced)}
        />
      ),
    },
  ];

  if (advanced) {
    steps.push({
      id: 'advanced',
      title: 'Advanced',
      description: 'Only shown in advanced mode.',
      content: <div>Tune things here.</div>,
    });
  }

  steps.push({
    id: 'finish',
    title: 'Finish',
    description: done ? 'Done!' : 'Check and create.',
    content: <div>Name: {name || '—'}</div>,
    next: { children: 'Create', onClick: () => setDone(true) },
  });

  return <Stepper steps={steps} />;
};
