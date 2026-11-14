import { Heading } from 'uilib';
import { ComponentLayout, TypesTable } from 'docs/components';

import example from '!!raw-loader!./Example';
import custom from '!!raw-loader!./Custom';

const Docs = () => (
  <>
    <p>
      A form split into steps. Each step has a title, a short description, its
      content, Prev/Next buttons and the Gallery dots between them. Steps can
      be added or removed on the fly; a step's <code>prev</code>/
      <code>next</code> override its buttons (label, props, <code>onClick</code>
      ; return <code>false</code> to stay), or <code>false</code> to hide them.
    </p>

    <Heading id="props" text="Props" />
    <TypesTable scope="Stepper" type="Props" />

    <Heading id="step" text="Step" />
    <TypesTable scope="Stepper" type="Step" />
  </>
);

export default () => (
  <ComponentLayout
    name="Stepper"
    docs={Docs}
    examples={[
      { id: 'demo', label: 'Demo', code: example },
      { id: 'custom', label: 'Custom buttons', code: custom },
    ]}
  />
);
