import { useState } from 'react';

import { ChatMessage } from 'uilib';

const at = '2026-08-22T15:04:00.000Z';
const flower =
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm';
const wav =
  'UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=';

const FORMATTING = [
  '# Heading 1',
  '## Heading 2',
  '**Bold**, *italic*, and inline `code`.',
  '',
  '```',
  'const hello = "world";',
  '```',
  '',
  '- Bullet one',
  '- Bullet two',
  '',
  '1. First',
  '2. Second',
  '',
  'A divider:',
  '',
  '---',
  '',
  'Markdown link: [uilib](https://uilib.apostol.space)',
  'Bare URL: https://example.com',
].join('\n');

const ITEMS = [
  {
    title: 'User',
    data: { id: 'user', role: 'USER', content: 'Show every message format.', createdAt: at },
  },
  {
    title: 'Agent — headings, emphasis, code, lists, divider, links',
    data: { id: 'fmt', role: 'AGENT', content: FORMATTING, createdAt: at },
  },
  {
    title: 'JSON',
    data: {
      id: 'json',
      role: 'AGENT',
      content: 'Result: {"ok":true,"count":3}',
      createdAt: at,
    },
  },
  {
    title: 'Table',
    data: {
      id: 'table',
      role: 'AGENT',
      content: '| Name | Size |\n| --- | --- |\n| **Alpha** | `s` |\n| Beta | m |',
      createdAt: at,
    },
  },
  {
    title: 'Buttons',
    data: {
      id: 'buttons',
      role: 'AGENT',
      content: 'Continue? [choice:yes|Yes] [choice:no|No]',
      createdAt: at,
    },
  },
  {
    title: 'userPrompt envelope',
    data: {
      id: 'prompt',
      role: 'USER',
      content: JSON.stringify({ type: 'userPrompt', display: 'Format this as a table' }),
      createdAt: at,
    },
  },
  {
    title: 'Image + text parts',
    data: {
      id: 'image',
      role: 'AGENT',
      content: JSON.stringify({
        parts: [
          { type: 'text', text: 'Screenshot from the last run:' },
          { type: 'image_url', image_url: { url: helpers.getRandomImageUrl(640, 360) } },
        ],
      }),
      createdAt: at,
    },
  },
  {
    title: 'Video',
    data: {
      id: 'video',
      role: 'AGENT',
      content: JSON.stringify({
        parts: [{ type: 'video_url', video_url: { url: flower } }],
      }),
      createdAt: at,
    },
  },
  {
    title: 'File',
    data: {
      id: 'file',
      role: 'AGENT',
      content: JSON.stringify({
        parts: [
          {
            type: 'file',
            file: { url: 'https://example.com/notes.txt', filename: 'notes.txt' },
          },
        ],
      }),
      createdAt: at,
    },
  },
  {
    title: 'Audio',
    data: {
      id: 'audio',
      role: 'AGENT',
      content: JSON.stringify({
        parts: [{ type: 'input_audio', input_audio: { data: wav, format: 'wav' } }],
      }),
      createdAt: at,
    },
  },
  {
    title: 'System — agent-selected',
    data: {
      id: 'sys-agent',
      role: 'SYSTEM',
      content: JSON.stringify({
        systemEventType: 'agent-selected',
        systemData: { agentId: 'research' },
      }),
    },
  },
  {
    title: 'System — function-call',
    data: {
      id: 'sys-fn',
      role: 'SYSTEM',
      content: JSON.stringify({
        systemEventType: 'function-call',
        systemData: { functionName: 'searchDocs' },
      }),
    },
  },
  {
    title: 'System — error',
    data: {
      id: 'sys-err',
      role: 'SYSTEM',
      content: JSON.stringify({
        systemEventType: 'error',
        systemData: { errorMessage: 'Timed out' },
      }),
    },
  },
  {
    title: 'System — conversation-stopped',
    data: {
      id: 'sys-stop',
      role: 'SYSTEM',
      content: JSON.stringify({
        systemEventType: 'conversation-stopped',
        systemData: {},
      }),
    },
  },
  {
    title: 'System — unknown event',
    data: {
      id: 'sys-other',
      role: 'SYSTEM',
      content: JSON.stringify({
        systemEventType: 'session-resumed',
        systemData: {},
      }),
    },
  },
  {
    title: 'System — tool invoked',
    data: {
      id: 'tool-in',
      role: 'SYSTEM',
      content: JSON.stringify({
        type: 'toolInvocation',
        name: 'readFile',
        phase: 'invoked',
      }),
    },
  },
  {
    title: 'System — tool failed',
    data: {
      id: 'tool-fail',
      role: 'SYSTEM',
      content: JSON.stringify({
        type: 'toolInvocation',
        name: 'readFile',
        ok: false,
        error: 'Not found',
      }),
    },
  },
  {
    title: 'System — tool result',
    data: {
      id: 'tool-ok',
      role: 'SYSTEM',
      content: JSON.stringify({ type: 'toolInvocation', name: 'readFile', ok: true }),
    },
  },
  {
    title: 'System — plain text',
    data: { id: 'sys-plain', role: 'SYSTEM', content: 'Session started' },
  },
];

export default () => {
  const [lastClick, setLastClick] = useState('');

  return (
    <div className={S.list}>
      {lastClick && <div className={S.subtitle}>Last button: {lastClick}</div>}
      {ITEMS.map(item => (
        <div className={S.block} key={item.data.id}>
          <div className={S.subtitle}>{item.title}</div>
          <ChatMessage
            data={item.data}
            onButtonClick={params => setLastClick(JSON.stringify(params))}
          />
        </div>
      ))}
      <div className={S.block}>
        <div className={S.subtitle}>Stacked agent replies</div>
        <ChatMessage
          data={{ id: 'stack-1', role: 'AGENT', content: 'First reply.', createdAt: at }}
        />
        <ChatMessage
          data={{ id: 'stack-2', role: 'AGENT', content: 'Follow-up, stacked.', createdAt: at }}
          isStacked
        />
      </div>
    </div>
  );
};
