import { Heading, Link } from 'uilib';
import { ComponentLayout, TypesTable } from 'docs/components';

import basic from '!!raw-loader!./Basic';
import advanced from '!!raw-loader!./Advanced';

const name = 'Theme';
const examples = [
  {
    id: 'demo',
    label: 'Demo',
    code: basic,
  },
  {
    id: 'advanced',
    label: 'Advanced',
    code: advanced,
  },
];

const Docs = () => (
  <>
    <p>Allow define the look and feel of UI components easily.</p>
    <p>
      Just pass a JSON object to the component with the desired colors, sizes,
      and other styles. The component then applies those styles to all the
      library components using CSS variables.
    </p>

    <Heading id="props" text="Props" />
    <TypesTable
      scope={name}
      type="Props"
      customLinks={{ ThemeConfig: '#ThemeConfig' }}
    />

    <Heading id="ThemeConfig" text="ThemeConfig" />
    <table>
      <thead>
        <tr>
          <th>Field</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>base</td>
          <td>
            <ul>
              <li>indent-s</li>
              <li>indent-m</li>
              <li>indent-l</li>
              <li>border-radius-s</li>
              <li>border-radius-m</li>
              <li>border-radius-l</li>
            </ul>
          </td>
        </tr>
        <tr>
          <td>colors</td>
          <td>
            <ul>
              <li>active</li>
              <li>accent</li>
              <li>decent</li>
              <li>warning</li>
              <li>danger</li>
              <li>disabled</li>
              <li>link</li>
            </ul>
          </td>
        </tr>
        <tr>
          <td>rest</td>
          <td>Any other values that will be rendered as CSS variables</td>
        </tr>
      </tbody>
    </table>

    <Heading id="ThemeDefaults" text="ThemeDefaults" />
    <table>
      <thead>
        <tr>
          <th>Field</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>colors</td>
          <td>
            <ul>
              <li>light</li>
              <li>dark</li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>

    <Heading id="ThemeHelpers" text="ThemeHelpers" />
    <table>
      <thead>
        <tr>
          <th>Field</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>colorsConfigToVars</td>
          <td>
            Function takes a ThemeConfig object, which contains color
            definitions for various states, and returns a new object that
            contains CSS variable declarations for each color and its associated
            variations.
          </td>
        </tr>
        <tr>
          <td>getColors</td>
          <td>
            <p>
              The function takes an optional object parameter with default
              values for accent, decent, active, warning, danger, disabled, and
              link colors.
            </p>
            <p>
              Returns a ColorConfig, which defines the color palette for a user
              interface.
            </p>
          </td>
        </tr>
        <tr>
          <td>getConfig</td>
          <td>Function</td>
        </tr>
      </tbody>
    </table>
  </>
);

export default () => (
  <ComponentLayout name="Theme" examples={examples} docs={Docs} />
);
