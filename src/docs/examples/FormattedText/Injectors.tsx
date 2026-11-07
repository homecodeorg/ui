import { FormattedText } from 'uilib';

// An injector finds the first match in a piece of plain text and says what to
// render for it: { elem, index, length }, or null when there is no match.
const injectHashtag = content => {
  const match = content.match(/#([a-z]\w*)/i);
  if (!match) return null;

  return {
    elem: <mark>{match[1]}</mark>,
    index: match.index,
    length: match[0].length,
  };
};

const MARKDOWN = `
Ship it #friday, then tell #everyone. **Bold** still works.

| Topic |
| --- |
| #cells too |

\`\`\`
#code stays untouched
\`\`\`
`;

export default () => (
  <FormattedText injectors={[injectHashtag]} text={MARKDOWN} />
);
