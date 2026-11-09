import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { Img } from './Img';

describe('Img', () => {
  test('renders the image while it loads', () => {
    render(<Img src="/a.png" alt="A" />);
    expect(screen.getByRole('img', { name: 'A' }).tagName).toBe('IMG');
  });

  test('shows the broken-image icon instead of a failed image', () => {
    const onError = jest.fn();
    const { container } = render(
      <Img src="/missing.png" alt="Missing" onError={onError} />
    );
    fireEvent.error(container.querySelector('img')!);
    expect(container.querySelector('img')).toBeNull();
    expect(screen.getByRole('img', { name: 'Missing' }).tagName).toBe('SPAN');
    expect(onError).toHaveBeenCalledTimes(1);
  });

  test('renders a custom fallback and retries a new src', () => {
    const { container, rerender } = render(
      <Img src="/x.png" fallback={<b>png</b>} />
    );
    fireEvent.error(container.querySelector('img')!);
    expect(screen.getByText('png')).toBeInTheDocument();

    rerender(<Img src="/y.png" fallback={<b>png</b>} />);
    expect(container.querySelector('img')).toHaveAttribute('src', '/y.png');
  });

  test('renders the fallback when there is no src', () => {
    render(<Img fallback={<i>none</i>} />);
    expect(screen.getByText('none')).toBeInTheDocument();
  });
});
