import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { config } from 'uilib/tools/config';

import { Popup } from './Popup';

beforeAll(() => {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }) as unknown as MediaQueryList;
});

beforeEach(() => {
  const overlay = document.createElement('div');
  overlay.id = config.appOverlayId;
  document.body.appendChild(overlay);
});

afterEach(() => {
  document.getElementById(config.appOverlayId)?.remove();
});

const pointer = (type: string, target: Element) =>
  act(() => {
    fireEvent(
      target,
      new (window.PointerEvent ?? MouseEvent)(type, { bubbles: true }) as Event
    );
  });

describe('Popup outside press', () => {
  // Android long-press (and touch pans) end in pointercancel, not pointerup.
  it.each(['pointerup', 'pointercancel'])(
    'closes when an outside press ends in %s',
    endType => {
      const onClose = jest.fn();
      const outside = document.createElement('button');
      document.body.appendChild(outside);

      render(
        <Popup
          isOpen
          animated={false}
          onClose={onClose}
          trigger={<span>open</span>}
          content={<div>menu</div>}
        />
      );

      pointer('pointerdown', outside);
      pointer(endType, outside);

      expect(onClose).toHaveBeenCalled();
      outside.remove();
    }
  );
});
