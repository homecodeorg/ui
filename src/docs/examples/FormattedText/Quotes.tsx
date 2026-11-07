import { FormattedText } from 'uilib';

const MARKDOWN = `
> Unified Memory (RAM): Starts at 16GB
> (configurable up to 24GB)

> Ports: Thunderbolt 5 (3 ports)

What is this all about?

\`\`\`
> a \`>\` inside a code block stays code
\`\`\`
`;

export default () => <FormattedText quotes text={MARKDOWN} />;
