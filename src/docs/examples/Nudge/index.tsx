import { Heading } from 'uilib';
import { ComponentLayout } from 'docs/components';

import example from '!!raw-loader!./Example';

const name = 'Nudge';

const Docs = () => (
  <>
    <p>
      Inline callout for a suggested next action: message, optional error, and
      a control such as a button.
    </p>

    <Heading id="usage" text="Usage" />
    <p>
      Render <code>NudgeText</code> and <code>NudgeError</code> as children so
      callers control order alongside extra content (progress, actions).
    </p>
  </>
);

export default () => (
  <ComponentLayout
    name={name}
    docs={Docs}
    examples={[{ id: 'demo', label: 'Demo', code: example }]}
    scope={{}}
  />
);
