import { useState } from 'react';

import { FormattedText } from 'uilib';

const MARKDOWN = [
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

const TABLE = '| Name | Size |\n| --- | --- |\n| **Alpha** | `s` |\n| Beta | m |';

export default () => {
  const [lastClick, setLastClick] = useState('');

  return (
    <div className={S.list}>
      {lastClick && <div className={S.subtitle}>Last button: {lastClick}</div>}
      <div className={S.block}>
        <div className={S.subtitle}>
          Headings, emphasis, code, lists, divider, links
        </div>
        <FormattedText text={MARKDOWN} />
      </div>
      <div className={S.block}>
        <div className={S.subtitle}>JSON</div>
        <FormattedText text='Result: {"ok":true,"count":3}' />
      </div>
      <div className={S.block}>
        <div className={S.subtitle}>Table</div>
        <FormattedText text={TABLE} />
      </div>
      <div className={S.block}>
        <div className={S.subtitle}>Buttons</div>
        <FormattedText
          text="Continue? [choice:yes|Yes] [choice:no|No]"
          onButtonClick={params => setLastClick(JSON.stringify(params))}
        />
      </div>
    </div>
  );
};
