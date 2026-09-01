import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { FormattedText } from './FormattedText';
import S from './FormattedText.styl';

jest.mock('uilib/components/Router/Link/Link', () => ({
  Link: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href?: string;
  }) => <a href={href}>{children}</a>,
}));

jest.mock('uilib/components/Tooltip/Tooltip', () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const COMBINED = `
# Heading 1
## Heading 2
**Bold**, *italic*, and inline \`code\`.
---
\`\`\`
const hello = "world";
\`\`\`
---
- Bullet one
- Bullet two
---
1. First
2. Second
---
Markdown link: [uilib](https://uilib.apostol.space)
Bare URL: https://example.com
Result: {"ok":true,"count":3}
| Name | Size |
| --- | --- |
| **Alpha** | \`s\` |
| Beta | m |

---

Continue? [choice:yes|Yes] [choice:no|No]
`;

describe('FormattedText', () => {
  test('renders choice tokens as buttons in combined markdown', () => {
    render(<FormattedText text={COMBINED} />);

    expect(screen.getByRole('button', { name: 'Yes' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'No' })).toBeInTheDocument();
    expect(screen.queryByText(/\[choice:yes\|Yes\]/)).not.toBeInTheDocument();
  });

  test('calls onButtonClick with token payload', async () => {
    const onButtonClick = jest.fn();
    render(<FormattedText text={COMBINED} onButtonClick={onButtonClick} />);

    await userEvent.click(screen.getByRole('button', { name: 'Yes' }));
    expect(onButtonClick).toHaveBeenCalledWith({
      text: 'Yes',
      choice: 'yes',
    });
  });

  test('renders --- after a table as a horizontal rule, not literal text', () => {
    const text = `| Name | Size |
| --- | --- |
| **Alpha** | \`s\` |
| Beta | m |

---

Continue? [choice:yes|Yes] [choice:no|No]
`;
    const { container } = render(<FormattedText text={text} />);

    expect(container.textContent).not.toMatch(/---/);
    expect(container.querySelector(`.${S.line}`)).toBeInTheDocument();
    expect(screen.getByText(/Continue\?/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Yes' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'No' })).toBeInTheDocument();
  });

  test('renders thematic break after table in combined example markdown', () => {
    const { container } = render(<FormattedText text={COMBINED} />);

    expect(container.textContent).not.toMatch(/---\s*Continue/);
    expect(container.querySelectorAll(`.${S.line}`).length).toBeGreaterThan(0);
    expect(screen.getByText(/Continue\?/)).toBeInTheDocument();
  });

  test('blank lines become line breaks, not one collapsed text node', () => {
    const { container } = render(
      <FormattedText text={'First paragraph.\n\nSecond paragraph.'} />,
    );
    const root = container.firstElementChild as HTMLElement;
    const textNodes = Array.from(root.childNodes)
      .filter(n => n.nodeType === Node.TEXT_NODE)
      .map(n => n.textContent);

    expect(root.querySelectorAll('br').length).toBeGreaterThanOrEqual(2);
    expect(
      textNodes.some(t => t?.includes('First') && t.includes('Second')),
    ).toBe(false);
  });

  test('consecutive lines after HR and around links do not collapse', () => {
    const text = `2. Second
---
Markdown link: [uilib](https://uilib.apostol.space)

Bare URL: https://example.com

Result: {"ok":true,"count":3}
`;
    const { container } = render(<FormattedText text={text} />);
    const root = container.firstElementChild as HTMLElement;
    const textNodes = Array.from(root.childNodes)
      .filter(n => n.nodeType === Node.TEXT_NODE)
      .map(n => n.textContent ?? '');

    expect(container.querySelector(`.${S.line}`)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'uilib' })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'https://example.com' }),
    ).toBeInTheDocument();
    expect(container.querySelector('pre')).toHaveTextContent(/"ok": true/);
    expect(root.querySelectorAll('br').length).toBeGreaterThan(0);
    expect(
      textNodes.some(
        t => t.includes('Markdown link') && t.includes('Bare URL'),
      ),
    ).toBe(false);
    expect(
      textNodes.some(t => t.includes('Bare URL') && t.includes('Result')),
    ).toBe(false);
  });
});
