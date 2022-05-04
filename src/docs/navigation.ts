type RouteLoader = () => Promise<any>;
export type RouteItem = {
  slug: string;
  loader: RouteLoader;
  items?: RouteLoader; // sub navigation
};

export default [
  {
    slug: 'Button',
    loader: () => import('./examples/Button'),
  },
  {
    slug: 'Checkbox',
    loader: () => import('./examples/Checkbox'),
  },
  {
    slug: 'Input',
    loader: () => import('./examples/Input'),
  },
  {
    slug: 'InputFile',
    loader: () => import('./examples/InputFile'),
  },
  {
    slug: 'Select',
    loader: () => import('./examples/Select/Select'),
  },
  {
    slug: 'Popup',
    loader: () => import('./examples/Popup'),
  },
  {
    slug: 'PopupMenu',
    loader: () => import('./examples/PopupMenu'),
  },
  {
    slug: 'Form',
    loader: () => import('./examples/Form'),
  },
  {
    slug: 'Spinner',
    loader: () => import('./examples/Spinner'),
  },
  {
    slug: 'Icon',
    loader: () => import('./examples/Icon'),
  },
  {
    slug: 'Link',
    loader: () => import('./examples/Link'),
  },
  {
    slug: 'DateTime',
    loader: () => import('./examples/DateTime'),
  },
  {
    slug: 'Scroll',
    loader: () => import('./examples/Scroll'),
  },
  {
    slug: 'Gallery',
    loader: () => import('./examples/Gallery'),
  },
  {
    slug: 'LightBox',
    loader: () => import('./examples/LightBox'),
  },
  {
    slug: 'Virtualized',
    loader: () => import('./examples/Virtualized'),
  },
  {
    slug: 'Notifications',
    loader: () => import('./examples/Notifications'),
  },
  {
    slug: 'Router',
    loader: () => import('./examples/Router'),
  },
] as RouteItem[];
