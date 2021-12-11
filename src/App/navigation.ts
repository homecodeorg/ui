export default [
  {
    name: 'button',
    loader: () => import('../components/Button/Button.example'),
  },
  {
    name: 'checkbox',
    loader: () => import('../components/Checkbox/Checkbox.example'),
  },
  {
    name: 'input',
    loader: () => import('../components/Input/Input.example'),
  },
  {
    name: 'icon',
    loader: () => import('../components/Icon/Icon.example'),
  },
  // {
  //   name: 'menu',
  //   loader: () => import('../components/Menu/Menu.example'),
  // },
  {
    name: 'popup',
    loader: () => import('../components/Popup/Popup.example'),
  },
  {
    name: 'select',
    loader: () => import('../components/Select/Select.example'),
  },
  {
    name: 'scroll',
    loader: () => import('../components/Scroll/Scroll.example'),
  },
  {
    name: 'virtualized',
    loader: () => import('../components/Virtualized/Virtualized.example'),
  },
  // {
  //   name: 'notifications',
  //   loader: () => import('../components/Notifications/Notifications.example'),
  // },
];
