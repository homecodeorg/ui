import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { FormattedText } from './FormattedText';
import type { Injector } from './FormattedText.types';
import S from './FormattedText.styl';

jest.mock('uilib/components/Router/Link/Link', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href?: string }) => (
    <a href={href}>{children}</a>
  ),
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
      <FormattedText text={'First paragraph.\n\nSecond paragraph.'} />
    );
    const root = container.firstElementChild as HTMLElement;
    const textNodes = Array.from(root.childNodes)
      .filter(n => n.nodeType === Node.TEXT_NODE)
      .map(n => n.textContent);

    expect(root.querySelectorAll('br').length).toBeGreaterThanOrEqual(2);
    expect(
      textNodes.some(t => t?.includes('First') && t.includes('Second'))
    ).toBe(false);
  });

  test('app http URLs become //app paths (router root), not current-route relative', () => {
    render(
      <FormattedText text="See [OFAC](http://localhost:3040/app/investigate/doc/opensanctions%3Aofac-pr-a45ec49b63a696b5af204fc59bdbd9d058d4ba2f)" />
    );

    expect(screen.getByRole('link', { name: 'OFAC' })).toHaveAttribute(
      'href',
      '//app/investigate/doc/opensanctions%3Aofac-pr-a45ec49b63a696b5af204fc59bdbd9d058d4ba2f'
    );
  });

  test('external http URLs stay absolute', () => {
    render(
      <FormattedText text="See [OS](https://www.opensanctions.org/entities/ofac-pr)" />
    );

    expect(screen.getByRole('link', { name: 'OS' })).toHaveAttribute(
      'href',
      'https://www.opensanctions.org/entities/ofac-pr'
    );
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
      screen.getByRole('link', { name: 'https://example.com' })
    ).toBeInTheDocument();
    expect(container.querySelector('pre')).toHaveTextContent(/"ok": true/);
    expect(root.querySelectorAll('br').length).toBeGreaterThan(0);
    expect(
      textNodes.some(t => t.includes('Markdown link') && t.includes('Bare URL'))
    ).toBe(false);
    expect(
      textNodes.some(t => t.includes('Bare URL') && t.includes('Result'))
    ).toBe(false);
  });
  describe('quotes', () => {
    const quotesOf = (container: HTMLElement) =>
      Array.from(container.querySelectorAll('[data-quote]')).map(
        el => el.textContent
      );

    test('shows a `> ` line as a quote when asked to', () => {
      const { container } = render(
        <FormattedText quotes text={'> a passage\n\nwhat is this?'} />
      );

      expect(quotesOf(container)).toEqual(['a passage']);
      expect(container.querySelector(`.${S.quote}`)).toBeInTheDocument();
      expect(container.textContent).toContain('what is this?');
      expect(container.textContent).not.toContain('>');
    });

    test('shows each quote of a message separately', () => {
      const { container } = render(
        <FormattedText quotes text={'> one\n\n> two\n\nask'} />
      );

      expect(quotesOf(container)).toEqual(['one', 'two']);
    });

    test('keeps the lines of one quote together, blank ones too', () => {
      const { container } = render(
        <FormattedText quotes text={'> one\n> two\n>\n> three\nask'} />
      );

      expect(quotesOf(container)).toEqual(['one\ntwo\n\nthree']);
    });

    test('shows a quote after other text', () => {
      const { container } = render(
        <FormattedText quotes text={'see this\n> a passage\nwhy?'} />
      );

      expect(quotesOf(container)).toEqual(['a passage']);
      expect(container.textContent).toContain('see this');
      expect(container.textContent).toContain('why?');
    });

    test('formats the text around a quote as usual', () => {
      render(<FormattedText quotes text={'> a passage\n\n**why** so?'} />);

      expect(screen.getByText('why').tagName).toBe('STRONG');
    });

    test('leaves a `>` inside a code block alone', () => {
      const { container } = render(
        <FormattedText quotes text={'```\n> not a quote\n```'} />
      );

      expect(quotesOf(container)).toEqual([]);
      expect(container.textContent).toContain('> not a quote');
    });

    test('leaves `>` text alone when not asked', () => {
      const { container } = render(<FormattedText text={'> a passage'} />);

      expect(quotesOf(container)).toEqual([]);
      expect(container.textContent).toContain('> a passage');
    });
  });

  describe('injectors', () => {
    const shout: Injector = content => {
      const matches = content.match(/#(\w+)/);
      if (!matches) return null;
      return {
        elem: <mark>{matches[1].toUpperCase()}</mark>,
        index: matches.index!,
        length: matches[0].length,
      };
    };

    test('renders what an extra injector finds', () => {
      render(
        <FormattedText injectors={[shout]} text="hello #world and #you" />
      );

      expect(screen.getByText('WORLD').tagName).toBe('MARK');
      expect(screen.getByText('YOU').tagName).toBe('MARK');
    });

    test('tries extra injectors before the built-in ones', () => {
      const asPlain: Injector = content => {
        const matches = content.match(/\*\*raw\*\*/);
        if (!matches) return null;
        return {
          elem: <span>{matches[0]}</span>,
          index: matches.index!,
          length: matches[0].length,
        };
      };
      const { container } = render(
        <FormattedText injectors={[asPlain]} text="**raw** and **bold**" />
      );

      expect(container.querySelector('strong')).toHaveTextContent('bold');
      expect(screen.getByText('**raw**').tagName).toBe('SPAN');
    });

    test('leaves the inside of a code block to the code block', () => {
      const { container } = render(
        <FormattedText injectors={[shout]} text={'```\n#tag\n```\n#real'} />
      );

      expect(container.querySelector('code')).toHaveTextContent('#tag');
      expect(screen.getAllByText('REAL')).toHaveLength(1);
      expect(screen.queryByText('TAG')).not.toBeInTheDocument();
    });

    test('runs before the JSON built-in', () => {
      const asJson: Injector = content => {
        const index = content.indexOf('{"a":1}');
        if (index < 0) return null;
        return {
          elem: <em data-testid="own-json">a is 1</em>,
          index,
          length: 7,
        };
      };
      const { container } = render(
        <FormattedText injectors={[asJson]} text={'see {"a":1} here'} />
      );

      expect(screen.getByTestId('own-json')).toBeInTheDocument();
      expect(container.querySelector('pre')).not.toBeInTheDocument();
    });

    test('also runs on the cells of a table', () => {
      render(
        <FormattedText
          injectors={[shout]}
          text={'| Name |\n| --- |\n| #alpha |\n'}
        />
      );

      expect(screen.getByText('ALPHA').tagName).toBe('MARK');
    });

    test('built-ins still work next to extra injectors', () => {
      render(<FormattedText injectors={[shout]} text="#tag and *italic*" />);

      expect(screen.getByText('TAG')).toBeInTheDocument();
      expect(screen.getByText('italic').tagName).toBe('EM');
    });
  });
  describe('breaks', () => {
    test('keeps newlines as text when turned off', () => {
      const { container } = render(
        <FormattedText breaks={false} text={'one\ntwo\n\nthree'} />
      );

      expect(container.querySelector('br')).not.toBeInTheDocument();
      expect(container.textContent).toBe('one\ntwo\n\nthree');
    });

    test('turns newlines into <br> by default', () => {
      const { container } = render(<FormattedText text={'one\ntwo'} />);

      expect(container.querySelectorAll('br')).toHaveLength(1);
    });

    test('a heading swallows the blank lines around it when newlines stay text', () => {
      const { container } = render(
        <FormattedText breaks={false} text={'before\n\n## Title\n\nafter'} />
      );

      expect(container.querySelector('h2')).toHaveTextContent('Title');
      expect(container.textContent).toBe('beforeTitleafter');
    });
  });
});
