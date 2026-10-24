import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { config } from 'uilib/tools/config';

import { NestedMenu } from './NestedMenu';

beforeAll(() => {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }) as unknown as MediaQueryList;
});

// Popup portals into the app overlay.
beforeEach(() => {
  const overlay = document.createElement('div');
  overlay.id = config.appOverlayId;
  document.body.appendChild(overlay);
});

afterEach(() => {
  document.getElementById(config.appOverlayId)?.remove();
});

const renderMenu = (onPick = jest.fn(), onOpenChange = jest.fn()) =>
  render(
    <NestedMenu
      open
      onOpenChange={onOpenChange}
      searchable
      popupProps={{ animated: false }}
      searchPlaceholder="Search threads"
      trigger={<span>open</span>}
      items={[
        { id: 'a', label: 'Alpha plan', onClick: () => onPick('a') },
        { id: 'b', label: 'Beta notes', onClick: () => onPick('b') },
        {
          id: 'c',
          label: <b>Gamma</b>,
          searchText: 'Gamma draft',
          onClick: () => onPick('c'),
        },
      ]}
    />
  );

describe('NestedMenu search', () => {
  test('filters items by label and searchText', async () => {
    renderMenu();
    const input = await screen.findByPlaceholderText('Search threads');
    await userEvent.type(input, 'draft');
    expect(screen.queryByText('Alpha plan')).not.toBeInTheDocument();
    expect(screen.getByText('Gamma')).toBeInTheDocument();
  });

  test('shows empty state when nothing matches', async () => {
    renderMenu();
    const input = await screen.findByPlaceholderText('Search threads');
    await userEvent.type(input, 'zzz');
    expect(screen.getByText('Nothing found')).toBeInTheDocument();
  });

  test('Enter picks the first match and closes', async () => {
    const onPick = jest.fn();
    const onOpenChange = jest.fn();
    renderMenu(onPick, onOpenChange);
    const input = await screen.findByPlaceholderText('Search threads');
    await userEvent.type(input, 'beta{Enter}');
    expect(onPick).toHaveBeenCalledWith('b');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
