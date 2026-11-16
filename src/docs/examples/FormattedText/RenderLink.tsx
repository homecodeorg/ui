import { FormattedText } from 'uilib';

const TEXT = `Read [the release notes](https://github.com/homecodeorg/ui/releases) or open https://www.npmjs.com/package/@homecode/ui`;

export default () => (
  <FormattedText
    text={TEXT}
    renderLink={({ href, text }) => (
      <a href={href} target="_blank" rel="noreferrer" title={new URL(href).hostname}>
        {text} ↗
      </a>
    )}
  />
);
