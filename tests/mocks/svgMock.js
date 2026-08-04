const React = require('react');

function SvgMock(props) {
  return React.createElement('svg', {
    ...props,
    'data-testid': 'svg-mock',
  });
}

module.exports = {
  __esModule: true,
  default: SvgMock,
  ReactComponent: SvgMock,
};
