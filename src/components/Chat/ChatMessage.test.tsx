import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { ChatMessage } from './ChatMessage';
import { ChatView } from './ChatView';
import S from './ChatMessage.styl';

jest.mock('uilib/components/Router/Link/Link', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href?: string }) => (
    <a href={href}>{children}</a>
  ),
}));

jest.mock('uilib/components/Tooltip/Tooltip', () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('ChatMessage author', () => {
  it('renders the author in the meta row, next to the time', () => {
    render(
      <ChatMessage
        data={{
          role: 'USER',
          author: 'Alice',
          content: 'Hi',
          createdAt: '2026-08-22T15:04:00.000Z',
        }}
      />,
    );
    const author = screen.getByText('Alice');
    expect(author).toHaveClass(S.author);
    expect(author.parentElement).toHaveClass(S.meta);
    expect(author.parentElement?.textContent).toMatch(/^Alice\d/);
  });

  it('renders the meta row for an author without a date', () => {
    render(<ChatMessage data={{ role: 'USER', author: 'Alice', content: 'Hi' }} />);
    expect(screen.getByText('Alice').parentElement).toHaveClass(S.meta);
  });

  it('hides the author when stacked', () => {
    render(
      <ChatMessage
        data={{ role: 'USER', author: 'Alice', content: 'Hi' }}
        isStacked
      />,
    );
    expect(screen.queryByText('Alice')).not.toBeInTheDocument();
  });

  it('renders no author element when author is absent', () => {
    const { container } = render(
      <ChatMessage data={{ role: 'USER', content: 'Hi' }} />,
    );
    expect(container.querySelector(`.${S.author}`)).toBeNull();
  });
});

describe('ChatView author stacking', () => {
  it('does not stack consecutive messages from different authors', () => {
    render(
      <ChatView
        messages={[
          { id: '1', role: 'USER', author: 'Alice', content: 'One' },
          { id: '2', role: 'USER', author: 'Alice', content: 'Two' },
          { id: '3', role: 'USER', author: 'Bob', content: 'Three' },
        ]}
      />,
    );
    expect(screen.getAllByText('Alice')).toHaveLength(1);
    expect(screen.getAllByText('Bob')).toHaveLength(1);
  });
});
