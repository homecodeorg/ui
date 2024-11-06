import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Button } from './Button';

describe('Button', () => {
  test('renders with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('root');
    expect(button).toHaveClass('size-m');
    expect(button).toHaveClass('variant-default');
  });

  test('renders with custom className', () => {
    render(<Button className="custom-class">Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toHaveClass('custom-class');
  });

  test('renders with different variants', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('variant-primary');

    rerender(<Button variant="outlined">Outlined</Button>);
    expect(screen.getByRole('button')).toHaveClass('variant-outlined');
  });

  test('renders with different sizes', () => {
    const { rerender } = render(<Button size="s">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('size-s');

    rerender(<Button size="l">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('size-l');
  });

  test('renders in loading state', () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('loading');
    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  test('renders in checked state', () => {
    render(<Button checked>Checked</Button>);
    expect(screen.getByRole('button')).toHaveClass('checked');
  });

  test('renders as square', () => {
    render(<Button square>Square</Button>);
    expect(screen.getByRole('button')).toHaveClass('square');
  });

  test('renders with prefix and postfix elements', () => {
    render(
      <Button
        prefixElem={<span>Prefix</span>}
        postfixElem={<span>Postfix</span>}
      >
        Content
      </Button>
    );
    expect(screen.getByText('Prefix')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Postfix')).toBeInTheDocument();
  });

  test('calls onClick and focuses on click', async () => {
    const onClickMock = jest.fn();
    render(<Button onClick={onClickMock}>Click me</Button>);
    const button = screen.getByRole('button');
    await userEvent.click(button);
    expect(onClickMock).toHaveBeenCalled();
    expect(button).toHaveFocus();
  });

  test('disables button and removes focus when disabled prop is true', () => {
    const { rerender } = render(<Button>Enabled</Button>);
    const button = screen.getByRole('button');
    button.focus();
    expect(button).toHaveFocus();

    rerender(<Button disabled>Disabled</Button>);
    expect(button).toBeDisabled();
    expect(button).not.toHaveFocus();
    expect(button).toHaveAttribute('tabIndex', '-1');
  });
});
