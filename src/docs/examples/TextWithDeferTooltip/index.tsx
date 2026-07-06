import { Heading } from 'uilib';
import { ComponentLayout } from 'docs/components';

import demo from '!!raw-loader!./Example';
import { TypesTable } from 'uilib/docs/components/TypesNavigator/TypesNavigator';

import S from './styles.styl';

const name = 'TextWithDeferTooltip';

const Docs = () => (
  <>
    <p>
      Renders children in a div and shows a tooltip only when the text overflows
      horizontally or vertically. Hover the truncated text to reveal the full
      content.
    </p>

    <Heading id="Props" text="Props" />
    <TypesTable scope={name} type="Props" />
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
