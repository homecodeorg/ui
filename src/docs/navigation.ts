type RouteLoader = () => Promise<any>;
export type RouteItem = {
  slug: string;
  loader: RouteLoader;
  items?: RouteLoader; // sub navigation
};

export default [
  {
    slug: 'button',
    loader: () => import('./examples/Button'),
  },
  {
    slug: 'checkbox',
    loader: () => import('./examples/Checkbox'),
  },
  {
    slug: 'input',
    loader: () => import('./examples/Input'),
  },
  {
    slug: 'inputFile',
    loader: () => import('./examples/InputFile'),
  },
  {
    slug: 'spinner',
    loader: () => import('./examples/Spinner'),
  },
  {
    slug: 'form',
    loader: () => import('./examples/Form'),
  },
  {
    slug: 'icon',
    loader: () => import('./examples/Icon'),
  },
  {
    slug: 'link',
    loader: () => import('./examples/Link'),
  },
  {
    slug: 'popup',
    loader: () => import('./examples/Popup'),
  },
  {
    slug: 'popupMenu',
    loader: () => import('./examples/PopupMenu'),
  },
  {
    slug: 'gallery',
    loader: () => import('./examples/Gallery'),
  },
  {
    slug: 'lightBox',
    loader: () => import('./examples/LightBox'),
  },
  {
    slug: 'select',
    loader: () => import('./examples/Select/Select'),
  },
  {
    slug: 'scroll',
    loader: () => import('./examples/Scroll'),
  },
  {
    slug: 'virtualized',
    loader: () => import('./examples/Virtualized'),
  },
  {
    slug: 'notifications',
    loader: () => import('./examples/Notifications'),
  },
  {
    slug: 'router',
    loader: () => import('./examples/Router'),
  },
] as RouteItem[];
