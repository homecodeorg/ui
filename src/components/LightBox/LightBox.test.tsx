import { act, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { config } from 'uilib/tools/config';

import { LightBox } from './LightBox';

beforeEach(() => {
  const overlay = document.createElement('div');
  overlay.id = config.appOverlayId;
  document.body.appendChild(overlay);
  jest.useFakeTimers();
});

afterEach(() => {
  document.getElementById(config.appOverlayId)?.remove();
  jest.useRealTimers();
});

// identity-obj-proxy: class names are the style keys.
const root = () => document.querySelector('.root') as HTMLElement;

describe('LightBox blur', () => {
  it('has no blur while closed', () => {
    render(<LightBox isOpen={false} blur onClose={() => {}}>x</LightBox>);
    expect(root()).not.toHaveClass('blur');
  });

  it('blurs while open and keeps it until the fade-out ends', () => {
    const { rerender } = render(<LightBox isOpen blur onClose={() => {}}>x</LightBox>);
    expect(root()).toHaveClass('blur');

    rerender(<LightBox isOpen={false} blur onClose={() => {}}>x</LightBox>);
    expect(root()).toHaveClass('blur');

    act(() => {
      jest.advanceTimersByTime(250);
    });
    expect(root()).not.toHaveClass('blur');
  });
});
