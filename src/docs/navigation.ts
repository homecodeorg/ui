type RouteLoader = () => Promise<any>;
export type RouteItem = {
  slug: string;
  loader: RouteLoader;
  items?: RouteLoader; // sub navigation
};

export default [
  // {
  //   name: 'button',
  //   loader: () => import('./examples/Button/Button'),
  // },
  // {
  //   name: 'checkbox',
  //   loader: () => import('./examples/Checkbox/Checkbox'),
  // },
  // {
  //   name: 'input',
  //   loader: () => import('./examples/Input/Input'),
  // },
  // {
  //   name: 'icon',
  //   loader: () => import('./examples/Icon/Icon'),
  // },
  // // {
  // //   name: 'menu',
  // //   loader: () => import('./examples/Menu/Menu'),
  // // },
  {
    slug: 'popup',
    loader: () => import('./examples/Popup/Popup'),
  },
  {
    slug: 'select',
    loader: () => import('./examples/Select/Select'),
    items: () => import('./examples/Select/navigation'),
  },
  // {
  //   name: 'scroll',
  //   loader: () => import('./examples/Scroll/Scroll'),
  // },
  // {
  //   name: 'virtualized',
  //   loader: () => import('./examples/Virtualized/Virtualized'),
  // },
  // {
  //   name: 'notifications',
  //   loader: () => import('./examples/Notifications/Notifications'),
  // },
] as RouteItem[];
