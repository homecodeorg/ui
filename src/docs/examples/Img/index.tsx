import { Heading } from 'uilib';
import { ComponentLayout } from 'docs/components';

import demo from '!!raw-loader!./Example';
import { TypesTable } from 'uilib/docs/components/TypesNavigator/TypesNavigator';

import S from './styles.styl';

const name = 'Img';

const Docs = () => (
  <>
    <p>
      An <code>&lt;img&gt;</code> that never shows the browser's broken-image
      glyph or its alt text. When the image fails to load (or there is no{' '}
      <code>src</code>), it renders <code>fallback</code>: a broken-image icon
      by default, or any node you pass. <code>alt</code> defaults to an empty
      string.
    </p>

    <Heading id="Props" text="Props" />
    <TypesTable scope={name} type="Props" />
  </>
);

export default () => (
  <ComponentLayout
    name={name}
    docs={Docs}
    examples={[{ id: 'states', label: 'States', code: demo, scope: { S } }]}
    scope={{}}
  />
);
