import { Heading } from 'uilib';
import { ComponentLayout } from 'docs/components';

import demo from '!!raw-loader!./Example';
import quotes from '!!raw-loader!./Quotes';
import injectors from '!!raw-loader!./Injectors';
import breaks from '!!raw-loader!./Breaks';
import { TypesTable } from 'uilib/docs/components/TypesNavigator/TypesNavigator';

const name = 'FormattedText';

const Docs = () => (
  <>
    <p>
      Renders lightweight markdown: headings, emphasis, code, lists, dividers,
      links, pretty-printed JSON, tables, and optional{' '}
      <code>[name:value|label]</code> action buttons.
    </p>

    <p>
      <code>quotes</code> shows runs of <code>&gt; </code> lines as grayed-out
      quotes. <code>injectors</code> adds your own matchers: each gets the plain
      text outside tables and code blocks (and the cells of tables) and returns{' '}
      <code>{'{ elem, index, length }'}</code> for its first match, or{' '}
      <code>null</code>. They run before the other built-in ones, so they can
      take over JSON or links. <code>breaks</code> (on by default) turns
      newlines into <code>&lt;br&gt;</code>; turn it off when the container is{' '}
      <code>white-space: pre-wrap</code>.
    </p>

    <Heading id="Props" text="Props" />
    <TypesTable scope={name} type="FormattedTextProps" />
  </>
);

export default () => (
  <ComponentLayout
    name={name}
    docs={Docs}
    examples={[
      { id: 'demo', label: 'Demo', code: demo },
      { id: 'quotes', label: 'Quotes', code: quotes },
      { id: 'injectors', label: 'Injectors', code: injectors },
      { id: 'breaks', label: 'Breaks', code: breaks },
    ]}
    scope={{}}
  />
);
