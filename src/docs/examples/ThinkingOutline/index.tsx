import { Heading } from 'uilib';
import { ComponentLayout } from 'docs/components';

import demo from '!!raw-loader!./Example';
import { TypesTable } from 'uilib/docs/components/TypesNavigator/TypesNavigator';

import S from './styles.styl';

const name = 'ThinkingOutline';

const Docs = () => (
  <>
    <p>
      Orbiting glow outline for a relative parent (inherits{' '}
      <code>border-radius</code>). With <code>active</code> omitted, hover
      drives the glow; <code>active=true</code> forces it on;{' '}
      <code>active=false</code> keeps it off (hover does not activate).
    </p>
    <p>
      <code>gradients</code> stacks several orbiting arcs in the same outline;
      each one takes its own <code>color</code>, <code>speed</code> (1 = one
      lap per 3.5s), <code>reverse</code> and <code>phase</code> (starting
      point, 0..1 of a lap). <code>thickness</code> sets the width of the
      sharp line (default 1.5px) and <code>spread</code> how far the soft
      bloom reaches (default 20px); both can be overridden per gradient.
      Numbers are px.
    </p>

    <Heading id="Props" text="Props" />
    <TypesTable scope={name} type="ThinkingOutlineProps" />
    <TypesTable scope={name} type="ThinkingOutlineGradient" />
  </>
);

export default () => (
  <ComponentLayout
    name={name}
    docs={Docs}
    examples={[
      { id: 'variants', label: 'Variants', code: demo, scope: { S } },
    ]}
    scope={{}}
  />
);
