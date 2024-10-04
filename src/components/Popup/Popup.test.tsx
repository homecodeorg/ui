


import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Popup } from './Popup';
import '@testing-library/jest-dom';

describe('Popup Component', () => {
  test('renders without crashing', () => {
    render(<Popup content="Test Content" />);
  });

  test('renders with correct props', () => {
    render(<Popup content="Test Content" />);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('displays the correct content', () => {
    render(<Popup content="Test Content" />);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('handles user interactions correctly', () => {
    const handleClose = jest.fn();
    render(<Popup content="Test Content" onClose={handleClose} />);
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
