import { FormattedText } from 'uilib';

const MARKDOWN = `First line
Second line

A new paragraph after a blank line.

## A heading

Done.`;

export default () => (
  <div style={{ display: 'grid', gap: 16 }}>
    <div>
      <p>Default: every newline becomes a {'<br>'}</p>
      <FormattedText text={MARKDOWN} />
    </div>

    <div>
      <p>breaks={'{false}'}: newlines stay in the text (pre-wrap), a heading swallows the blank lines around it</p>
      <div style={{ whiteSpace: 'pre-wrap' }}>
        <FormattedText breaks={false} text={MARKDOWN} />
      </div>
    </div>
  </div>
);
