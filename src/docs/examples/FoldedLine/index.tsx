import { Heading } from 'uilib';
import { ComponentLayout, TypesTable } from 'docs/components';

import example from '!!raw-loader!./Example';

const name = 'FoldedLine';

const Docs = () => (
  <>
    <p>
      Collapsible row with a trigger and optional body. Default variant draws a
      side rail; <code>clear</code> is a flush toggle without gutter or fold
      chrome.
    </p>

    <Heading id="usage" text="Usage" />
    <p>
      Pass <code>trigger</code> (node or <code>(isFolded) =&gt; node</code>) and
      children. Use <code>FoldedLineAction</code> inside the body to park
      controls next to the Fold button.
    </p>

    <Heading id="props" text="Props" />
    <TypesTable scope={name} type="Props" />
  </>
);

export default () => (
  <ComponentLayout
    name={name}
    docs={Docs}
    examples={[{ id: 'demo', label: 'Demo', code: example }]}
  />
);
