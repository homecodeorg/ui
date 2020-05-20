export default [
  {
    name: 'button',
    loader: () => import('components/UI/Button/Button.example'),
  },
  {
    name: 'checkbox',
    loader: () => import('components/UI/Checkbox/Checkbox.example'),
  },
  {
    name: 'input',
    loader: () => import('components/UI/Input/Input.example'),
  },
  {
    name: 'icon',
    loader: () => import('components/UI/Icon/Icon.example'),
  },
  {
    name: 'menu',
    loader: () => import('components/UI/Menu/Menu.example'),
  },
  {
    name: 'popup',
    loader: () => import('components/UI/Popup/Popup.example'),
  },
  {
    name: 'notifications',
    loader: () => import('components/UI/Notifications/Notifications.example'),
  },
];
