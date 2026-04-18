import { Heading, Link } from 'uilib';
import { ComponentLayout } from 'docs/components';

import gallery from '!!raw-loader!./Showcase';

import S from './styles.styl';

const Docs = () => (
  <>
    <p>
      Single page with common form controls: every button size and variant,
      representative input types, and size × variant matrices for checkbox,
      toggle, and radio group (plus horizontal, disabled, and error radio
      samples).{' '}
      <Link inline href="/demo">
        Demo
      </Link>
    </p>

    <Heading id="about" text="About" />
    <p>
      Use this gallery to compare spacing, hit targets, and visual weight across
      components without switching between docs tabs.
    </p>
  </>
);

export default () => (
  <ComponentLayout
    name="ControlsShowcase"
    docs={Docs}
    examples={[{ id: 'gallery', label: 'Gallery', code: gallery }]}
    scope={{ S }}
  />
);
