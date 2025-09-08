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
        id: 'Autocomplete',
        loader: () => import('./examples/Autocomplete'),
      },
      {
        id: 'Button',
        loader: () => import('./examples/Button'),
      },
      {
        id: 'Calendar',
        loader: () => import('./examples/Calendar'),
      },
      {
        id: 'Checkbox',
        loader: () => import('./examples/Checkbox'),
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
        id: 'DateTime',
        loader: () => import('./examples/DateTime'),
      },
      {
        id: 'Draggable',
        loader: () => import('./examples/Draggable'),
      },
      {
        id: 'Form',
        loader: () => import('./examples/Form'),
      },
      {
        id: 'Gallery',
        loader: () => import('./examples/Gallery'),
      },
      {
        id: 'Icon',
        loader: () => import('./examples/Icon'),
      },
      {
        id: 'Input',
        loader: () => import('./examples/Input'),
      },
      {
        id: 'InputFile',
        loader: () => import('./examples/InputFile'),
      },
      {
        id: 'Lazy',
        loader: () => import('./examples/Lazy'),
      },
      {
        id: 'LightBox',
        loader: () => import('./examples/LightBox'),
      },
      {
        id: 'Link',
        loader: () => import('./examples/Link'),
      },
      {
        id: 'Menu',
        loader: () => import('./examples/Menu'),
      },
      {
        id: 'Notifications',
        loader: () => import('./examples/Notifications'),
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
        id: 'Progress',
        loader: () => import('./examples/Progress'),
      },
      {
        id: 'Router',
        loader: () => import('./examples/Router'),
      },
      {
        id: 'Scroll',
        loader: () => import('./examples/Scroll'),
      },
      {
        id: 'Select',
        loader: () => import('./examples/Select'),
      },
      {
        id: 'Spinner',
        loader: () => import('./examples/Spinner'),
      },
      {
        id: 'Table',
        loader: () => import('./examples/Table'),
      },
      {
        id: 'Tabs',
        loader: () => import('./examples/Tabs'),
      },
      {
        id: 'Toggle',
        loader: () => import('./examples/Toggle'),
      },
      {
        id: 'Tooltip',
        loader: () => import('./examples/Tooltip'),
      },
      {
        id: 'Theme',
        loader: () => import('./examples/Theme'),
      },
      {
        id: 'Virtualized',
        loader: () => import('./examples/Virtualized'),
      },
    ],
  },
  {
    id: 'services',
    label: 'Services',
    items: [
      {
        id: 'i18n',
        label: 'i18n',
        loader: () => import('./examples/i18n'),
      },
    ],
  },
] as GroupItem[];
