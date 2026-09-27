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

    <Heading id="Props" text="Props" />
    <TypesTable scope={name} type="ThinkingOutlineProps" />
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
