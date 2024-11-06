// Mock SVG imports
// jest.mock('\\.svg$', () => ({
//   ReactComponent: 'div',
//   default: 'svg-mock',
// }));

// Mock Spinner component globally
jest.mock('uilib/components/Spinner/Spinner', () => ({
  Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

// Add any other global mocks here
