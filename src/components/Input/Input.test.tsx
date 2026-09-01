import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { Input } from './Input';

describe('Input selectAllOnFocus', () => {
  test('selects all text on a native input', async () => {
    render(<Input selectAllOnFocus value="Alice" onChange={() => {}} />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    await userEvent.click(input);

    expect(input.value).toBe('Alice');
    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe(input.value.length);
  });

  test('does not throw when the control is a contenteditable textarea', async () => {
    render(
      <Input
        selectAllOnFocus
        type="textarea"
        value="Ask Alice"
        onChange={() => {}}
      />
    );

    const control = document.querySelector('[contenteditable]') as HTMLElement;
    expect(control).toBeTruthy();
    expect(typeof (control as HTMLInputElement).select).not.toBe('function');

    expect(() => {
      fireEvent.mouseDown(control);
      fireEvent.focus(control);
    }).not.toThrow();
  });
});
