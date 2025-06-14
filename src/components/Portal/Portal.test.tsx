import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Portal } from './Portal';

// Mock the env utility
jest.mock('uilib/tools/env', () => ({
  isBrowser: true,
}));

// Mock the config
jest.mock('uilib/tools/config', () => ({
  config: {
    appOverlayId: 'app-overlay',
  },
}));

describe('Portal', () => {
  beforeEach(() => {
    // Create default target element
    const defaultElement = document.createElement('div');
    defaultElement.id = 'app-overlay';
    document.body.appendChild(defaultElement);
  });

  afterEach(() => {
    // Clean up DOM
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  test('renders children into default target element', () => {
    render(<Portal>Hello Portal</Portal>);

    const defaultTarget = document.getElementById('app-overlay');
    expect(defaultTarget).toContainElement(screen.getByText('Hello Portal'));
  });

  test('renders children into custom selector', () => {
    // Create custom target element
    const customElement = document.createElement('div');
    customElement.id = 'custom-target';
    document.body.appendChild(customElement);

    render(<Portal selector="#custom-target">Custom Portal</Portal>);

    const customTarget = document.getElementById('custom-target');
    expect(customTarget).toContainElement(screen.getByText('Custom Portal'));
  });

  test('renders complex children correctly', () => {
    render(
      <Portal>
        <div data-testid="portal-content">
          <h1>Portal Header</h1>
          <button>Portal Button</button>
        </div>
      </Portal>
    );

    expect(screen.getByTestId('portal-content')).toBeInTheDocument();
    expect(screen.getByText('Portal Header')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /portal button/i })
    ).toBeInTheDocument();
  });

  test('handles missing target element gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

    render(<Portal selector="#non-existent">Should not render</Portal>);

    expect(screen.queryByText('Should not render')).not.toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Portal target element not found: #non-existent'
    );

    consoleSpy.mockRestore();
  });

  test('re-renders when selector changes', () => {
    // Create two target elements
    const target1 = document.createElement('div');
    target1.id = 'target-1';
    document.body.appendChild(target1);

    const target2 = document.createElement('div');
    target2.id = 'target-2';
    document.body.appendChild(target2);

    const { rerender } = render(
      <Portal selector="#target-1">Moving Content</Portal>
    );

    expect(target1).toContainElement(screen.getByText('Moving Content'));
    expect(target2).not.toContainElement(screen.getByText('Moving Content'));

    rerender(<Portal selector="#target-2">Moving Content</Portal>);

    expect(target1).not.toContainElement(screen.getByText('Moving Content'));
    expect(target2).toContainElement(screen.getByText('Moving Content'));
  });

  test('supports CSS class selectors', () => {
    const classTarget = document.createElement('div');
    classTarget.className = 'portal-target';
    document.body.appendChild(classTarget);

    render(<Portal selector=".portal-target">Class Selector</Portal>);

    expect(classTarget).toContainElement(screen.getByText('Class Selector'));
  });

  test('supports complex CSS selectors', () => {
    const container = document.createElement('div');
    container.setAttribute('data-portal', 'true');
    const target = document.createElement('div');
    target.className = 'nested-target';
    container.appendChild(target);
    document.body.appendChild(container);

    render(
      <Portal selector="[data-portal] .nested-target">Complex Selector</Portal>
    );

    expect(target).toContainElement(screen.getByText('Complex Selector'));
  });
});

describe('Portal SSR behavior', () => {
  beforeAll(() => {
    // Reset modules to clear previous mocks
    jest.resetModules();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('renders correctly when isBrowser is initially false', () => {
    // Mock SSR environment temporarily
    jest.doMock('uilib/tools/env', () => ({
      isBrowser: false,
    }));

    // This test verifies the component handles SSR gracefully
    // In real SSR, the component would mount after hydration
    const defaultElement = document.createElement('div');
    defaultElement.id = 'app-overlay';
    document.body.appendChild(defaultElement);

    // The current implementation starts with isBrowser state
    // This test documents the expected behavior
    render(<Portal>SSR Safe Content</Portal>);

    // Component should render because useLayoutEffect will set mounted to true
    expect(screen.getByText('SSR Safe Content')).toBeInTheDocument();
  });
});
