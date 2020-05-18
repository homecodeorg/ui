import { configure, addParameters, addDecorator } from '@storybook/preact';
import { create } from '@storybook/theming';
import 'babel-loader!./ThemeDecorator';

const theme = create({
  base: 'light',
  appContentBg: '#fff',
  appBorderColor: 'rgba(120,120,120,.1)',
  colorSecondary: '#222',
  brandTitle: 'ui–components',
  brandImage: '/logo.svg',
});

addParameters({ options: { theme }, uiTheme: 'light' });

configure(
  require.context('../src/components', true, /\.stories\.tsx$/),
  module
);
