const React = require('react');

module.exports = {
  ReactComponent: function SvgMock(props) {
    return React.createElement('svg', {
      ...props,
      'data-testid': 'svg-mock'
    });
  },
  default: 'SvgMock'
};
