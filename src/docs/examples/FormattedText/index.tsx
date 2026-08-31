import { Heading } from 'uilib';
import { ComponentLayout } from 'docs/components';

import demo from '!!raw-loader!./Example';
import { TypesTable } from 'uilib/docs/components/TypesNavigator/TypesNavigator';

import S from './styles.styl';

const name = 'FormattedText';

const Docs = () => (
  <>
    <p>
      Renders lightweight markdown: headings, emphasis, code, lists, dividers,
      links, pretty-printed JSON, tables, and optional{' '}
      <code>[name:value|label]</code> action buttons.
    </p>

    <Heading id="Props" text="Props" />
    <TypesTable scope={name} type="FormattedTextProps" />
  </>
);

export default () => (
  <ComponentLayout
    name={name}
    docs={Docs}
    examples={[{ id: 'demo', label: 'Demo', code: demo, scope: { S } }]}
    scope={{}}
  />
);
