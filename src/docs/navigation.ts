import { ReactNode } from 'react';

import { I18N } from 'docs/config/i18n';

type RouteLoader = () => Promise<any>;
export type RouteItem = {
  id: string;
  label: string;
  loader: RouteLoader;
};

export type GroupItem = {
  id: string;
  label: ReactNode;
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
        loader: () => import('./pages/About'),
      },
      {
        id: 'install',
        label: 'Installation',
        loader: () => import('./pages/Installation'),
      },
      {
        id: 'usage',
        label: 'Usage',
        loader: () => import('./pages/Usage'),
      },
    ],
  },
  {
    id: 'components',
    label: 'Components',
    items: [
      {
        id: 'Theme',
        loader: () => import('./examples/Theme'),
      },
      {
        id: 'Button',
        loader: () => import('./examples/Button'),
      },
      {
        id: 'Checkbox',
        loader: () => import('./examples/Checkbox'),
      },
      {
        id: 'Tabs',
        loader: () => import('./examples/Tabs'),
      },
      {
        id: 'Calendar',
        loader: () => import('./examples/Calendar'),
      },
      {
        id: 'DatePicker',
        loader: () => import('./examples/DatePicker'),
      },
      {
        id: 'DatePickerInput',
        loader: () => import('./examples/DatePickerInput'),
      },
      {
        id: 'Input',
        loader: () => import('./examples/Input'),
      },
      {
        id: 'Autocomplete',
        loader: () => import('./examples/Autocomplete'),
      },
      {
        id: 'InputFile',
        loader: () => import('./examples/InputFile'),
      },
      {
        id: 'Popup',
        loader: () => import('./examples/Popup'),
      },
      {
        id: 'PopupMenu',
        loader: () => import('./examples/PopupMenu'),
      },
      {
        id: 'Select',
        loader: () => import('./examples/Select'),
      },
      {
        id: 'Form',
        loader: () => import('./examples/Form'),
      },
      {
        id: 'Spinner',
        loader: () => import('./examples/Spinner'),
      },
      {
        id: 'Icon',
        loader: () => import('./examples/Icon'),
      },
      {
        id: 'DateTime',
        loader: () => import('./examples/DateTime'),
      },
      {
        id: 'Scroll',
        loader: () => import('./examples/Scroll'),
      },
      {
        id: 'Gallery',
        loader: () => import('./examples/Gallery'),
      },
      {
        id: 'LightBox',
        loader: () => import('./examples/LightBox'),
      },
      {
        id: 'Table',
        loader: () => import('./examples/Table'),
      },
      {
        id: 'Virtualized',
        loader: () => import('./examples/Virtualized'),
      },
      {
        id: 'Draggable',
        loader: () => import('./examples/Draggable'),
      },
      {
        id: 'Notifications',
        loader: () => import('./examples/Notifications'),
      },
      {
        id: 'Lazy',
        loader: () => import('./examples/Lazy'),
      },
      {
        id: 'Router',
        loader: () => import('./examples/Router'),
      },
      {
        id: 'Link',
        loader: () => import('./examples/Link'),
      },
      {
        id: 'Menu',
        loader: () => import('./examples/Menu'),
      },
    ],
  },
] as GroupItem[];
