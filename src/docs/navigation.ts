type RouteLoader = () => Promise<any>;
export type RouteItem = {
  id: string;
  label: string;
  loader: RouteLoader;
};

export type GroupItem = {
  id: string;
  label: string;
  items: RouteItem[];
  isOpen?: boolean;
};

export default [
  {
    id: 'intro',
    label: 'Introduction',
    items: [
      {
        id: 'about',
        label: 'About',
      },
      {
        id: 'getting-started',
        label: 'Getting Started',
      },
    ],
  },
  {
    id: 'components',
    label: 'Components',
    items: [
      {
        id: 'button',
        label: 'Button',
        loader: () => import('./examples/Button'),
      },
      {
        id: 'checkbox',
        label: 'Checkbox',
        loader: () => import('./examples/Checkbox'),
      },
      {
        id: 'input',
        label: 'Input',
        loader: () => import('./examples/Input'),
      },
      {
        id: 'inputfile',
        label: 'InputFile',
        loader: () => import('./examples/InputFile'),
      },
      {
        id: 'popup',
        label: 'Popup',
        loader: () => import('./examples/Popup'),
      },
      {
        id: 'popupmenu',
        label: 'PopupMenu',
        loader: () => import('./examples/PopupMenu'),
      },
      {
        id: 'select',
        label: 'Select',
        loader: () => import('./examples/Select/Select'),
      },
      {
        id: 'form',
        label: 'Form',
        loader: () => import('./examples/Form'),
      },
      {
        id: 'spinner',
        label: 'Spinner',
        loader: () => import('./examples/Spinner'),
      },
      {
        id: 'icon',
        label: 'Icon',
        loader: () => import('./examples/Icon'),
      },
      {
        id: 'datetime',
        label: 'DateTime',
        loader: () => import('./examples/DateTime'),
      },
      {
        id: 'scroll',
        label: 'Scroll',
        loader: () => import('./examples/Scroll'),
      },
      {
        id: 'gallery',
        label: 'Gallery',
        loader: () => import('./examples/Gallery'),
      },
      {
        id: 'lightbox',
        label: 'LightBox',
        loader: () => import('./examples/LightBox'),
      },
      {
        id: 'virtualized',
        label: 'Virtualized',
        loader: () => import('./examples/Virtualized'),
      },
      {
        id: 'notifications',
        label: 'Notifications',
        loader: () => import('./examples/Notifications'),
      },
      {
        id: 'router',
        label: 'Router',
        loader: () => import('./examples/Router'),
      },
      {
        id: 'link',
        label: 'Link',
        loader: () => import('./examples/Link'),
      },
    ],
  },
] as GroupItem[];
