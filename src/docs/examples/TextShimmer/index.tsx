import { Heading } from 'uilib';
import { ComponentLayout } from 'docs/components';

import demo from '!!raw-loader!./Example';
import { TypesTable } from 'uilib/docs/components/TypesNavigator/TypesNavigator';

import S from './styles.styl';

const name = 'TextShimmer';

const Docs = () => (
  <>
    <p>
      Animated shimmer over text via background clip. With{' '}
      <code>inverted=false</code>, the stationary layer follows the decent tone and the shimmering band
      follows the accent tone; set <code>inverted=true</code> to swap those roles. The theme{' '}
      <code>--accent-color</code> and <code>--decent-color</code> family variables supply defaults.
    </p>

    <Heading id="CSS variables" text="CSS variables" />
    <dl>
      <dt>
        <code>--text-shimmer-duration</code>
      </dt>
      <dd>
        One animation lap. Set automatically from <code>duration</code>. Stylesheet fallback:{' '}
        <code>1s</code>.
      </dd>
      <dt>
        <code>--text-shimmer-decent-tone</code>
      </dt>
      <dd>
        Optional ancestor override mapped to internal <code>--txt-sh-fill</code>. Falls back to{' '}
        <code>var(--decent-color)</code>.
      </dd>
      <dt>
        <code>--text-shimmer-accent-tone</code>
      </dt>
      <dd>
        Optional ancestor override mapped to internal <code>--txt-sh-highlight</code>. Falls back to{' '}
        <code>var(--accent-color)</code>.
      </dd>
      <dt>
        <code>--txt-sh-fill</code> / <code>--txt-sh-highlight</code>
      </dt>
      <dd>
        Declared on <code>S.root</code> — decent-toned vs accent-toned stops; which layer carries the{' '}
        shimmering band swaps when <code>inverted</code>.
      </dd>
    </dl>

    <Heading id="Props" text="Props" />
    <TypesTable scope={name} type="Props" />
  </>
);

export default () => (
  <ComponentLayout
    name={name}
    docs={Docs}
    examples={[{ id: 'variants', label: 'Variants', code: demo, scope: { S } }]}
    scope={{}}
  />
);
