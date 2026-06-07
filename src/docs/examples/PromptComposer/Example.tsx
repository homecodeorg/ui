import { useMemo, useState } from 'react';
import { PromptComposer, createPromptComposerHandle, promptComposerMentionNode } from 'uilib';

export default () => {
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [lastCommand, setLastCommand] = useState('');

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

  const onSlashItemCommand = (({ item, editor, range }) => {
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
        {
        replaceTriggerToken: false,
        },
      );
      return true;
    }

    return false;
  });

  return (
    <div>
      <PromptComposer
        placeholder="Type / to open commands"
        slashCommandItems={slashItems}
        onSlashItemCommand={onSlashItemCommand}
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
      </div>
    </div>
  );
};
