import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { EmojiSelector } from './EmojiSelector';
import {
  parseEmojiData,
  pushRecent,
  searchEmoji,
} from './EmojiSelector.helpers';
import { EMOJI_DATA } from './emojiData';

const categories = parseEmojiData(EMOJI_DATA);

describe('emoji data', () => {
  it('has every category and no skin tone duplicates', () => {
    expect(categories.map(c => c.id)).toEqual([
      'smileys',
      'nature',
      'food',
      'activity',
      'travel',
      'objects',
      'symbols',
      'flags',
    ]);
    const all = categories.flatMap(c => c.emojis.map(e => e.emoji));
    expect(new Set(all).size).toBe(all.length);
    expect(all.some(e => /\u{1F3FB}|\u{1F3FF}/u.test(e))).toBe(false);
  });

  it('finds emoji by word prefixes, name or the emoji itself', () => {
    const emojis = (q: string) => searchEmoji(categories, q).map(e => e.emoji);
    expect(emojis('thumbs up')).toContain('👍');
    expect(emojis('thumb')).toEqual(expect.arrayContaining(['👍', '👎']));
    expect(emojis('like')).toContain('👍');
    expect(emojis('🎉')).toEqual(['🎉']);
    expect(emojis('zzzqqq')).toEqual([]);
    expect(emojis('  ')).toEqual([]);
  });

  it('keeps the latest pick first', () => {
    expect(pushRecent(['a', 'b', 'c'], 'c', 3)).toEqual(['c', 'a', 'b']);
    expect(pushRecent(['a', 'b', 'c'], 'd', 3)).toEqual(['d', 'a', 'b']);
  });
});

describe('EmojiSelector', () => {
  beforeEach(() => localStorage.clear());

  it('searches and picks with Enter, remembering the pick', async () => {
    const onSelect = jest.fn();
    render(<EmojiSelector onSelect={onSelect} />);
    await screen.findByRole('button', { name: 'grinning face' });

    await userEvent.type(screen.getByPlaceholderText('Search'), 'party popper');
    expect(screen.queryByRole('button', { name: 'grinning face' })).toBeNull();
    await userEvent.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledWith('🎉');
    expect(
      JSON.parse(localStorage.getItem('homecode-ui-emoji-recent')!)
    ).toEqual(['🎉']);
  });

  it('shows an empty state and marks chosen emoji', async () => {
    render(
      <EmojiSelector
        onSelect={jest.fn()}
        selected={['👍']}
        labels={{ empty: 'Nothing here' }}
      />
    );
    const thumbs = await screen.findAllByRole('button', { name: 'thumbs up' });
    expect(thumbs[0]).toHaveAttribute('aria-pressed', 'true');
    await userEvent.type(screen.getByPlaceholderText('Search'), 'zzzqqq');
    await waitFor(() => expect(screen.getByText('Nothing here')).toBeVisible());
  });

  it('uses the recent prop instead of storage', async () => {
    const onSelect = jest.fn();
    render(<EmojiSelector onSelect={onSelect} recent={['🦄']} />);
    const unicorn = await screen.findAllByRole('button', { name: 'unicorn' });
    await userEvent.click(unicorn[0]);
    expect(onSelect).toHaveBeenCalledWith('🦄');
    expect(localStorage.getItem('homecode-ui-emoji-recent')).toBeNull();
  });

  it('renders only the rows in view', async () => {
    render(<EmojiSelector onSelect={jest.fn()} />);
    await screen.findByRole('button', { name: 'grinning face' });
    const total = categories.reduce((n, c) => n + c.emojis.length, 0);
    const rendered = document.querySelectorAll('[data-emoji]').length;
    expect(rendered).toBeGreaterThan(0);
    expect(rendered).toBeLessThan(total / 10);
  });

  it('moves with arrow keys across rows and section titles', async () => {
    render(<EmojiSelector onSelect={jest.fn()} />);
    await screen.findByRole('button', { name: 'grinning face' });
    const search = screen.getByPlaceholderText('Search');
    search.focus();

    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toHaveAttribute('data-emoji', '👍');
    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement).toHaveAttribute('data-emoji', '❤️');
    // Over the "Smileys & People" title into its first row, same column.
    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toHaveAttribute('data-emoji', '😃');
    await userEvent.keyboard('{ArrowLeft}');
    expect(document.activeElement).toHaveAttribute('data-emoji', '😀');
    // Left from a row's first emoji goes to the previous row's last one.
    await userEvent.keyboard('{ArrowLeft}');
    expect(document.activeElement).toHaveAttribute('data-emoji', '✅');
    await userEvent.keyboard('{ArrowUp}{ArrowUp}');
    expect(document.activeElement).toBe(search);
  });
});
