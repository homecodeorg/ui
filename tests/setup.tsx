// Mock SVG imports
// jest.mock('\\.svg$', () => ({
//   ReactComponent: 'div',
//   default: 'svg-mock',
// }));

// jsdom has no ResizeObserver — without it `uilib/tools/resizeObserver` falls
// back to an endless polling timer.
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock Spinner component globally
jest.mock('uilib/components/Spinner/Spinner', () => ({
  Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

// Add any other global mocks here
