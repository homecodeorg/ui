import { PromptComposer, createPromptComposerHandle, promptComposerMentionNode } from 'uilib';
import { useCallback, useMemo, useState } from 'react';

const AT_FILES = [
  {
    id: 'readme',
    label: 'README.md',
    description: 'Project readme',
    color: '#6366f1',
  },
  {
    id: 'package',
    label: 'package.json',
    description: 'Package manifest',
    color: '#0ea5e9',
  },
  {
    id: 'composer',
    label: 'PromptComposer.tsx',
    description: 'Composer component',
    color: '#f59e0b',
  },
];

export default () => {
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [lastCommand, setLastCommand] = useState('');
  const [lastAtMention, setLastAtMention] = useState('');

  const slashItems = useMemo(
    () => [
      {
        id: 'generate-dashboard',
        label: 'generate-dashboard',
        description: 'Generate analytics dashboard',
        color: '#00a9c7',
      },
      {
        id: 'map',
        label: 'map',
        description: 'Open map picker',
        color: '#16a34a',
      },
      {
        id: 'summarize',
        label: 'summarize',
        description: 'Summarize conversation context',
        color: '#d9a01a',
      },
    ],
    [],
  );

  const atMentionGetItems = useCallback(query => {
    const q = String(query ?? '')
      .trim()
      .toLowerCase();
    if (!q) return AT_FILES;
    return AT_FILES.filter(
      item =>
        item.label.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q),
    );
  }, []);

  const onSlashItemCommand = ({ item, editor, range }) => {
    if (!editor) return false;

    setLastCommand(item.id);

    if (item.id === 'map') {
      if (range) {
        editor.chain().focus().deleteRange(range).run();
      }
      const handle = createPromptComposerHandle(editor);
      handle.insertAtCaret(
        promptComposerMentionNode({
          id: item.id,
          label: item.label,
          color: item.color ?? null,
        }),
        { replaceTriggerToken: false },
      );
      return true;
    }

    return false;
  };

  const onAtItemCommand = ({ item }) => {
    setLastAtMention(item.label);
    return false; // default @ chip insert
  };

  return (
    <div>
      <PromptComposer
        placeholder="Type / for commands, @ for files"
        slashCommandItems={slashItems}
        onSlashItemCommand={onSlashItemCommand}
        atMentionGetItems={atMentionGetItems}
        onAtItemCommand={onAtItemCommand}
        onChange={text => setValue(text)}
        onSubmit={text => setSubmitted(text)}
      />

      <div style={{ marginTop: 12, fontSize: 13 }}>
        <div>
          <b>Draft:</b> {value || '<empty>'}
        </div>
        <div>
          <b>Submitted:</b> {submitted || '<none>'}
        </div>
        <div>
          <b>Last slash command:</b> {lastCommand || '<none>'}
        </div>
        <div>
          <b>Last @ mention:</b> {lastAtMention || '<none>'}
        </div>
      </div>
    </div>
  );
};
