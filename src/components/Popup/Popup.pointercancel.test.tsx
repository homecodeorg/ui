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

  it('stays open when the press that opened it ends in pointercancel', () => {
    const onClose = jest.fn();
    const outside = document.createElement('button');
    document.body.appendChild(outside);

    const props = {
      animated: false,
      onClose,
      trigger: <span>open</span>,
      content: <div>menu</div>,
    };
    const { rerender } = render(<Popup isOpen={false} {...props} />);

    // Long-press: the press starts while closed, the menu opens mid-press.
    pointer('pointerdown', outside);
    rerender(<Popup isOpen {...props} />);
    pointer('pointercancel', outside);
    expect(onClose).not.toHaveBeenCalled();

    // A later outside press still closes it.
    pointer('pointerdown', outside);
    pointer('pointercancel', outside);
    expect(onClose).toHaveBeenCalled();
    outside.remove();
  });

  it('stays open when mounted open mid-press and the press is cancelled', () => {
    const onClose = jest.fn();
    const outside = document.createElement('button');
    document.body.appendChild(outside);

    pointer('pointerdown', outside);
    render(
      <Popup
        isOpen
        animated={false}
        onClose={onClose}
        trigger={<span>open</span>}
        content={<div>menu</div>}
      />
    );
    pointer('pointercancel', outside);
    expect(onClose).not.toHaveBeenCalled();
    outside.remove();
  });
});
