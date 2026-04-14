import { Heading, Table, useTheme } from 'uilib';
import { ComponentLayout, TypesTable } from 'docs/components';

import demo from '!!raw-loader!./Demo';
import { useCallback, useEffect } from 'react';

const name = 'Theme';
const examples = [
  {
    id: 'demo',
    label: 'Demo',
    code: demo,
  },
];

const Docs = () => (
  <>
    <p>Allow define the look and feel of UI components easily.</p>
    <p>
      Just pass a JSON object to the component with the desired colors, sizes,
      and other styles. The component then applies those styles to all the
      library components using CSS variables. In apps, wrap the tree with{' '}
      <code>ThemeProvider</code> (it renders <code>Theme</code> and exposes{' '}
      <code>useTheme()</code>).
    </p>

    <Heading id="props" text="Props" />
    <TypesTable
      scope={name}
      type="Props"
      customLinks={{ ThemeConfig: '#ThemeConfig' }}
    />

    <Heading id="ThemeConfig" text="ThemeConfig" />
    <Table
      blur
      columns={[
        {
          id: 'field',
          label: 'Field',
        },
        {
          id: 'description',
          label: 'Description',
        },
      ]}
      data={[
        {
          field: 'base',
          description: (
            <ul>
              <li>p-1 … p-20 (spacing scale, 4px per step)</li>
              <li>border-radius-s</li>
              <li>border-radius-m</li>
              <li>border-radius-l</li>
            </ul>
          ),
        },
        {
          field: 'colors',
          description: (
            <ul>
              <li>active</li>
              <li>accent</li>
              <li>decent</li>
              <li>surface</li>
              <li>warning</li>
              <li>danger</li>
              <li>disabled</li>
              <li>link</li>
            </ul>
          ),
        },
        {
          field: 'rest',
          description:
            'Any other values that will be rendered as CSS variables',
        },
      ]}
    />

    <Heading id="ThemeDefaults" text="ThemeDefaults" />
    <Table
      blur
      columns={[
        {
          id: 'field',
          label: 'Field',
        },
        {
          id: 'description',
          label: 'Description',
        },
      ]}
      data={[
        {
          field: 'colors',
          description: (
            <ul>
              <li>light</li>
              <li>dark</li>
            </ul>
          ),
        },
      ]}
    />

    <Heading id="ThemeHelpers" text="ThemeHelpers" />
    <Table
      blur
      columns={[
        {
          id: 'field',
          label: 'Field',
        },
        {
          id: 'description',
          label: 'Description',
        },
      ]}
      data={[
        {
          field: 'colorsConfigToVars',
          description: `Function takes a ThemeConfig object, which contains color
          definitions for various states, and returns a new object that
          contains CSS variable declarations for each color and its associated
          variations.`,
        },
        {
          field: 'getColors',
          description: (
            <>
              <p>
                The function takes an optional object parameter with default
                values for accent, decent, active, warning, danger, disabled,
                and link colors.
              </p>
              <p>
                Returns a ColorConfig, which defines the color palette for a
                user interface.
              </p>
            </>
          ),
        },
        {
          field: 'getConfig',
          description: 'Function',
        },
      ]}
    />
  </>
);

export default function Theme() {
  const { toggleTheme } = useTheme();

  const onDocClick = useCallback(e => {
    if (e.target.type === 'checkbox') {
      toggleTheme();
    }
  }, [toggleTheme]);

  useEffect(() => {
    document.addEventListener('click', onDocClick, true);
    return () => {
      document.removeEventListener('click', onDocClick, true);
    };
  }, []);

  return (
    <ComponentLayout name="Theme" examples={examples} docs={Docs} />
  );
}
