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
    slug: 'select',
    loader: () => import('./examples/Select/Select'),
  },
  {
    slug: 'form',
    loader: () => import('./examples/Form'),
  },
  {
    slug: 'spinner',
    loader: () => import('./examples/Spinner'),
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
    slug: 'scroll',
    loader: () => import('./examples/Scroll'),
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
