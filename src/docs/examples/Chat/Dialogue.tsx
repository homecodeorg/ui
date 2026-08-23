import { useState } from 'react';

import { ChatPrompt, ChatView } from 'uilib';

const at = '2026-08-22T15:04:00.000Z';

const INITIAL = [
  {
    id: '1',
    role: 'USER',
    content: 'Summarize the last run and list next steps.',
    createdAt: at,
  },
  {
    id: '2',
    role: 'SYSTEM',
    content: JSON.stringify({
      systemEventType: 'agent-selected',
      systemData: { agentId: 'research' },
    }),
  },
  {
    id: '3',
    role: 'AGENT',
    content: [
      '## Summary',
      'Build **passed**. Coverage is `91%`.',
      '',
      '1. Ship the docs example',
      '2. Watch the canary',
      '',
      'More in the [changelog](https://example.com).',
    ].join('\n'),
    createdAt: at,
  },
  {
    id: '4',
    role: 'AGENT',
    content: 'Want me to open a PR? [choice:yes|Open PR] [choice:no|Not now]',
    createdAt: at,
  },
  {
    id: '5',
    role: 'USER',
    content: 'Yes — open it and ping me when CI is green.',
    createdAt: at,
  },
  {
    id: '6',
    role: 'AGENT',
    content: 'Opened **#482**. I will ping you when CI is green.',
    createdAt: at,
  },
  {
    id: '7',
    role: 'USER',
    content: 'Also paste the canary checklist in the PR description.',
    createdAt: at,
  },
  {
    id: '8',
    role: 'AGENT',
    content:
      'Done. Checklist is in the description: smoke, rollback, and watch the error rate for 15 minutes.',
    createdAt: at,
  },
];

const MODELS = [
  { id: 'auto', label: 'Auto Router' },
  { id: 'gpt', label: 'GPT' },
  { id: 'claude', label: 'Claude' },
];

export default () => {
  const [messages, setMessages] = useState(INITIAL);
  const [value, setValue] = useState('');
  const [isPrompting, setIsPrompting] = useState(false);
  const [model, setModel] = useState('auto');

  const append = (role, content) => {
    setMessages(prev => [
      ...prev,
      { id: `${Date.now()}-${prev.length}`, role, content, createdAt: new Date() },
    ]);
  };

  const reply = text => {
    setIsPrompting(true);
    window.setTimeout(() => {
      append('AGENT', `Got it — **${text}**.`);
      setIsPrompting(false);
    }, 2500);
  };

  const onSubmit = text => {
    append('USER', text);
    setValue('');
    reply(text);
  };

  return (
    <div className={S.view}>
      <ChatView
        messages={messages}
        isPrompting={isPrompting}
        onButtonClick={({ text }) => {
          append('USER', text);
          reply(text);
        }}
        footer={
          <ChatPrompt
            value={value}
            onChange={setValue}
            onSubmit={onSubmit}
            disabled={isPrompting}
            isPrompting={isPrompting}
            models={MODELS}
            model={model}
            onModelChange={setModel}
            placeholder="Message"
          />
        }
      />
    </div>
  );
};
